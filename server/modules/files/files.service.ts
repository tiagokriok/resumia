import { TRPCError } from '@trpc/server'
import { createPresignedUrl } from '~/server/providers/s3'
import { Context } from '~/server/trpc/context'
import { CreateFileInput } from './dto'
import { File, Files } from './files.schema'

class FileService {
  public static async createPresignedUrl({
    input,
    ctx,
  }: {
    input: CreateFileInput
    ctx: Context
  }): Promise<{
    file: File
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
      file,
      presignedUrl,
    }
  }
}

export default FileService
