import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3,
} from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { z } from 'zod'

const envSchema = z.object({
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_DEFAULT_REGION: z.string().default('sa-east-1'),
  AWS_BUCKET: z.string().default('resumia'),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables')
}

export const env = _env.data

export const s3 = new S3({
  region: env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})

export async function createPresignedUrl(
  action: 'GET' | 'PUT' | 'POST',
  key: string,
  expiresIn: number = 60,
) {
  if (action === 'GET') {
    const config: GetObjectCommandInput = {
      Bucket: env.AWS_BUCKET,
      Key: key,
    }

    const command = new GetObjectCommand(config)

    const url = await getSignedUrl(s3, command, { expiresIn })

    return { url }
  }

  if (action === 'PUT') {
    const config: PutObjectCommandInput = {
      Bucket: env.AWS_BUCKET,
      Key: key,
    }

    const command = new PutObjectCommand(config)

    const url = await getSignedUrl(s3, command, { expiresIn })

    return { url }
  }

  if (action === 'POST') {
    const { url, fields } = await createPresignedPost(s3, {
      Bucket: env.AWS_BUCKET,
      Key: key,
      Conditions: [
        // {
        //   acl: 'public-read',
        // },
        { bucket: env.AWS_BUCKET },
        ['starts-with', '$key', key],
        ['content-length-range', 0, 1024 * 1024 * 10], // max 5MB
      ],
      Fields: {
        // acl: 'public-read',
      },
      Expires: expiresIn,
    })

    console.log(url, fields)

    return { url, fields }
  }

  return null
}
