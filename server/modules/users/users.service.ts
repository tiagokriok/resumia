import { TRPCError } from '@trpc/server'
import { SearchQuery } from '../../../lib/types/Search'
import { Context } from '../../trpc/context'
import { User, Users } from './users.schema'

export const findUsers = async ({
  input,
  ctx,
}: {
  input: SearchQuery
  ctx: Context
}): Promise<{
  total: number
  items: Omit<User, 'password' | 'rememberToken'>[]
}> => {
  const user = ctx.user

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
    })
  }

  const filter = {
    isDeleted: input.withTrash,
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

  const total = await Users.count(filter)
  const users = await Users.find(filter, projection, {
    offset: input.offset,
    limit: input.limit,
    sort: {
      [`${input.orderBy}`]: input.order,
    },
  }).lean()

  return {
    total,
    items: users,
  }
}

export const updateLanguage = async ({
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

  await Users.updateOne(
    {
      id: user.id,
    },
    {
      $set: {
        language: input,
      },
    },
  )
}
