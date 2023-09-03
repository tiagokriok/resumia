import { TRPCError } from '@trpc/server'
import { SearchQuery } from '~/lib/types/Search'
import { Context } from '~/server/trpc/context'
import { Conversation, Conversations } from './conversations.schema'

export const find = async ({
  input,
  ctx,
}: {
  input: SearchQuery
  ctx: Context
}): Promise<{ total: number; items: Conversation[] }> => {
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

  const total = await Conversations.count(filter)
  const conversations = await Conversations.find(filter, projection, {
    skip: input.offset,
    take: input.limit,
    sort: {
      [`${input.orderBy}`]: input.order,
    },
  })

  return {
    total,
    items: conversations,
  }
}
