import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3,
} from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const config = useRuntimeConfig()

export const s3 = new S3({
  region: config.awsDefaultRegion,
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
  },
})

export async function createPresignedUrl(
  action: 'GET' | 'PUT' | 'POST',
  key: string,
  expiresIn: number = 60,
) {
  if (action === 'GET') {
    const configCMD: GetObjectCommandInput = {
      Bucket: config.awsBucket,
      Key: key,
    }

    const command = new GetObjectCommand(configCMD)

    const url = await getSignedUrl(s3, command, { expiresIn })

    return { url }
  }

  if (action === 'PUT') {
    const configCMD: PutObjectCommandInput = {
      Bucket: config.awsBucket,
      Key: key,
    }

    const command = new PutObjectCommand(configCMD)

    const url = await getSignedUrl(s3, command, { expiresIn })

    return { url }
  }

  if (action === 'POST') {
    const { url, fields } = await createPresignedPost(s3, {
      Bucket: config.awsBucket,
      Key: key,
      Conditions: [
        // {
        //   acl: 'public-read',
        // },
        { bucket: config.awsBucket },
        ['starts-with', '$key', key],
        ['content-length-range', 0, 1024 * 1024 * 10], // 10MB
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
