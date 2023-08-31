import { GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3'
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
  action: 'GET' | 'PUT',
  key: string,
  expiresIn: number = 60,
) {
  const config = {
    Bucket: env.AWS_BUCKET,
    Key: key,
  }

  const command =
    action === 'GET'
      ? new GetObjectCommand(config)
      : new PutObjectCommand(config)

  return await getSignedUrl(s3, command, { expiresIn })
}
