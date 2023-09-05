import { TRPCError } from '@trpc/server'
import { Context } from '~/server/trpc/context'
import { Message, Messages } from './messages.schema'

export const findMessages = async ({
  input,
  ctx,
}: {
  input: string
  ctx: Context
}): Promise<Message[]> => {
  const user = ctx.user

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
    })
  }

  const messages = await Messages.find({
    chatId: input,
  })

  return messages
}
