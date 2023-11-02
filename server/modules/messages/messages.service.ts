import { Message } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { Context } from '~/server/trpc/context'

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

  const messages = await ctx.prisma.message.findMany({
    where: {
      chatId: input,
      chat: {
        userId: user.id,
      },
    },
  })

  return messages
}
