import { Chat } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { SearchQuery } from '~/lib/types/Search'
import { Context } from '~/server/trpc/context'

interface RecentlyChats {
  id: string
  label: string | null
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
    userId: ctx.user.id,
  }

  if (input.searchText) {
    // @ts-ignore
    filter.OR = [
      {
        label: {
          contains: input.searchText,
        },
      },
      {
        file: {
          label: {
            contains: input.searchText,
          },
        },
      },
      {
        messages: {
          every: {
            content: {
              contains: input.searchText,
            },
          },
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

  const total = await ctx.prisma.chat.count({
    where: filter,
  })

  const chats = await ctx.prisma.chat.findMany({
    where: filter,
    select: {
      file: true,
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          content: true,
          role: true,
        },
      },
      ...(Object.keys(projection).length && { projection }),
    },
    skip: input.offset,
    take: input.limit,
    orderBy: {
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

  const chat = await ctx.prisma.chat.findUnique({
    where: {
      id: input,
      userId: user.id,
    },
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

  const chats = await ctx.prisma.chat.findMany({
    where: {
      userId: ctx.user.id,
    },
    select: {
      id: true,
      label: true,
      file: {
        select: {
          id: true,
          label: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
        select: {
          content: true,
        },
      },
      updatedAt: true,
    },
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return chats.map((chat) => {
    return {
      id: chat.id,
      label: chat.label,
      lastMessage: chat.messages[0].content,
      fileId: chat.file.id,
      fileLabel: chat.file.label,
      updatedAt: chat.updatedAt,
    }
  })
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

  const chat = await ctx.prisma.chat.create({
    data: {
      userId: user.id,
      fileId: input.id,
    },
  })

  return chat
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

  await ctx.prisma.chat.update({
    where: {
      id: input.chatId,
      userId: user.id,
    },
    data: {
      label: input.label,
    },
  })
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

  await ctx.prisma.chat.delete({
    where: {
      id: input,
      userId: user.id,
    },
  })
}
