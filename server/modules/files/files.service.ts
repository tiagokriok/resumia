import { TRPCError } from '@trpc/server'
import { createPresignedUrl } from '~/server/providers/s3'
import { Context } from '~/server/trpc/context'
import { CreateFileInput } from './dto'
import { Files } from './files.schema'

class FileService {
  public static async createPresignedUrl({
    input,
    ctx,
  }: {
    input: CreateFileInput
    ctx: Context
  }): Promise<{
    fileId: string
    presignedUrl: string
  }> {
    const user = ctx.user

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      })
    }

    const file = await Files.create({
      ...input,
      owner: {
        id: user.id,
        name: user.name,
      },
    })

    const presignedUrl = await createPresignedUrl(
      'PUT',
      `${user.id}/${file.id}`,
      30,
    )

    return {
      fileId: file.id,
      presignedUrl,
    }
  }
}

export default FileService
