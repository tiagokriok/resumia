import { TRPCError } from '@trpc/server'
import { SearchQuery } from '../../../lib/types/Search'
import { Context } from '../../trpc/context'
import { UpdateUserInput } from './dto'
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

export const updateProfile = async ({
  input,
  ctx,
}: {
  input: UpdateUserInput
  ctx: Context
}) => {
  const user = ctx.user

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
    })
  }

  if (input.email !== user.email) {
    // TODO: send verification email

    const userExists = await Users.findOne({
      email: input.email,
    })

    if (userExists) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Email already exists',
      })
    }
  }

  const userUpdated = await Users.findOneAndUpdate(
    {
      id: user.id,
    },
    {
      $set: input,
    },
    {
      new: true,
    },
  ).lean()

  if (!userUpdated) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'User not found',
    })
  }

  const { password, rememberToken, ...userWithoutPassword } = userUpdated

  return userWithoutPassword
}
