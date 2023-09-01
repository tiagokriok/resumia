import { TRPCError } from '@trpc/server'
import fs from 'node:fs'
import { mkdtemp, unlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { Readable } from 'node:stream'
import { finished } from 'node:stream/promises'
import {
  embedDocuments,
  pdfLoader,
  splitter,
} from '~/server/providers/langchain'
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

  public static async embedFile({
    input,
    ctx,
  }: {
    input: string
    ctx: Context
  }) {
    const user = ctx.user

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      })
    }

    const file = await Files.findOne({ id: input, 'owner.id': user.id })

    if (!file) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'File not found',
      })
    }

    const url = await createPresignedUrl('GET', `${user.id}/${input}`, 60)

    const response = await fetch(url)

    if (!response.ok) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
      })
    }

    const tmpDir = await mkdtemp(path.join(tmpdir(), `${user.id}`))

    const destination = path.resolve(tmpDir, file.name)
    const fileStream = fs.createWriteStream(destination, { flags: 'w' })

    // @ts-ignore
    await finished(Readable.fromWeb(response.body).pipe(fileStream))

    const documents = await pdfLoader(destination)
    const splittedDocuments = await splitter(documents)
    await embedDocuments(splittedDocuments, `${user.id}:${file.id}`)

    await unlink(destination)

    sseHooks.callHook('sse:event', {
      id: file.id,
      name: file.name,
      finished: true,
    })
  }
}

export default FileService
