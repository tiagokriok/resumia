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
import { SearchQuery } from '../../../lib/types/Search'
import { CreateFileInput, UpdateFileInput } from './dto'
import { File, Files } from './files.schema'

export const findFiles = async ({
  input,
  ctx,
}: {
  input: SearchQuery
  ctx: Context
}): Promise<{ total: number; items: File[] }> => {
  const user = ctx.user

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    })
  }

  const filter = {
    isDeleted: input.withTrash,
  }

  if (input.searchText) {
    // @ts-ignore
    filter.$or = [
      {
        name: { $regex: input.searchText, $options: 'i' },
      },
      {
        description: { $regex: input.searchText, $options: 'i' },
      },
      {
        label: { $regex: input.searchText, $options: 'i' },
      },
    ]
  }

  const projection: { [key: string]: number | string } = {}

  if (input.columns?.length) {
    input.columns.forEach((column: string | { field: string; as: string }) => {
      if (typeof column === 'string') {
        if (column !== 'password') {
          projection[column] = 1
        }
      } else {
        projection[column.field] = `$${column.as}`
      }
    })
  }

  const total = await Files.count(filter)
  const files = await Files.find(filter, projection, {
    skip: input.offset,
    take: input.limit,
    sort: {
      [`${input.orderBy}`]: input.order,
    },
  })

  return {
    total,
    items: files,
  }
}

export const createFile = async ({
  input,
  ctx,
}: {
  input: CreateFileInput
  ctx: Context
}): Promise<{
  file: File
  presignedUrl: string
}> => {
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
    file: file.toObject(),
    presignedUrl,
  }
}

export const updateFile = async ({
  input,
  ctx,
}: {
  input: UpdateFileInput
  ctx: Context
}) => {
  const user = ctx.user

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    })
  }

  const file = await Files.updateOne(
    {
      id: input.id,
      'owner.id': user.id,
    },
    {
      $set: {
        label: input.label,
        description: input.description,
      },
    },
  )

  return file
}

export const embedFile = async ({
  input,
  ctx,
}: {
  input: string
  ctx: Context
}) => {
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
  await embedDocuments(splittedDocuments, file.id)

  await unlink(destination)

  sseHooks.callHook('sse:event', {
    id: file.id,
    name: file.name,
    finished: true,
  })
}

export const deleteFile = async ({
  input,
  ctx,
}: {
  input: string
  ctx: Context
}) => {
  const user = ctx.user

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    })
  }

  await Files.deleteOne({ id: input, 'owner.id': user.id })
}
