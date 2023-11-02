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
    userId: user.id,
  }

  if (input.searchText) {
    // @ts-ignore
    filter.OR = [
      {
        name: {
          contains: input.searchText,
        },
      },
      {
        description: {
          contains: input.searchText,
        },
      },
      {
        label: {
          contains: input.searchText,
        },
      },
    ]
  }

  const projection: { [key: string]: boolean } = {}

  if (input.columns?.length) {
    input.columns.forEach((column: string) => {
      if (column !== 'password') {
        projection[column] = true
      }
    })
  }

  const total = await ctx.prisma.file.count({
    where: filter,
  })
  const files = await ctx.prisma.file.findMany({
    where: filter,
    take: input.limit,
    skip: input.offset,
    orderBy: {
      createdAt: 'desc',
    },
    ...(Object.keys(projection).length && {
      select: {
        ...projection,
      },
    }),
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
}) => {
  const user = ctx.user

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    })
  }

  const file = await ctx.prisma.file.create({
    data: {
      userId: user.id,
      ...input,
    },
  })

  return file
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

  const file = await ctx.prisma.file.update({
    where: {
      id: input.id,
      userId: user.id,
    },
    data: {
      label: input.label,
      description: input.description,
    },
  })

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

  const file = await ctx.prisma.file.findUnique({
    where: {
      id: input,
      userId: user.id,
    },
  })

  if (!file) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'File not found',
    })
  }

  //TODO: Add supabase
  const presigned = await createPresignedUrl('GET', `${user.id}/${input}`, 60)

  if (!presigned) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
    })
  }

  const response = await fetch(presigned.url)

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

  await ctx.prisma.file.delete({
    where: {
      id: input,
      userId: user.id,
    },
  })
}
