import { TRPCError } from '@trpc/server'
import { SearchQuery } from '~/lib/types/Search'
import { Context } from '~/server/trpc/context'
import { Chat, Chats } from './chats.schema'

interface RecentlyChats {
  id: string
  label: string
  lastMessage: string
  fileId: string
  fileLabel: string
  updatedAt: Date
}

export const findChats = async ({
  input,
  ctx,
}: {
  input: SearchQuery
  ctx: Context
}): Promise<{ total: number; items: Chat[] }> => {
  if (!ctx.user?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
    })
  }

  const filter = {
    isDeleted: input.withTrash,
    'owner.id': ctx.user?.id,
  }

  if (input.searchText) {
    // @ts-ignore
    filter.$or = [
      {
        label: { $regex: input.searchText, $options: 'i' },
      },
      {
        'file.label': { $regex: input.searchText, $options: 'i' },
      },
      {
        'messages.content': { $regex: input.searchText, $options: 'i' },
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
        if (column.field !== 'password') {
          projection[column.as] = `$${column.field}`
        }
      }
    })
  }

  const total = await Chats.count(filter)
  const chats = await Chats.find(filter, projection, {
    skip: input.offset,
    take: input.limit,
    sort: {
      [`${input.orderBy}`]: input.order,
    },
  })

  return {
    total,
    items: chats,
  }
}

export const findOneChat = async ({
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
      message: 'Unauthorized',
    })
  }

  const chat = await Chats.findOne({
    id: input,
    'owner.id': user.id,
  })

  if (!chat) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Chat not found',
    })
  }

  return chat
}

export const getRecentlyChats = async ({
  ctx,
}: {
  ctx: Context
}): Promise<RecentlyChats[]> => {
  if (!ctx.user?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
    })
  }

  const recentlyChats: RecentlyChats[] = await Chats.find(
    {
      'owner.id': ctx.user?.id,
      isDeleted: false,
    },
    {
      id: 1,
      label: 1,
      fileId: '$file.id',
      fileLabel: '$file.label',
      lastMessage: {
        $last: '$messages.content',
      },
      updatedAt: 1,
    },
    {
      limit: 5,
      sort: {
        updatedAt: 'desc',
      },
    },
  ).lean()

  return recentlyChats
}

export const createChat = async ({
  input,
  ctx,
}: {
  input: {
    id: string
    label: string
  }
  ctx: Context
}) => {
  const user = ctx.user

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
    })
  }

  const chat = await Chats.create({
    owner: {
      id: user.id,
      name: user.name,
    },
    file: {
      id: input.id,
      label: input.label,
    },
    messages: [],
  })

  return chat.toObject()
}

export const updateChat = async ({
  input,
  ctx,
}: {
  input: {
    chatId: string
    label: string
  }
  ctx: Context
}) => {
  const user = ctx.user

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
    })
  }

  await Chats.updateOne(
    {
      id: input.chatId,
      'owner.id': user.id,
    },
    {
      $set: {
        label: input.label,
      },
    },
  )
}

export const deleteChat = async ({
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
      message: 'Unauthorized',
    })
  }

  await Chats.updateOne(
    {
      id: input,
      'owner.id': user.id,
    },
    {
      $set: {
        isDeleted: true,
        deletedAt: Date.now(),
      },
    },
  )
}
