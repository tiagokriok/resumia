import { z } from 'zod'
import { searchSchema } from '~/lib/types/Search'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { createChat, findChats, getRecentlyChats } from './chats.service'

export const chatRouter = router({
  find: protectedProcedure.input(searchSchema).query(findChats),
  getRecentlyChats: protectedProcedure.query(getRecentlyChats),
  create: protectedProcedure
    .input(
      z.object({
        id: z.string().regex(/^[0-9A-Za-z]{12}$/),
        label: z.string(),
      }),
    )
    .mutation(createChat),
})
