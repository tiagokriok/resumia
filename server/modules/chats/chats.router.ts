import { z } from 'zod'
import { searchSchema } from '~/lib/types/Search'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import {
  createChat,
  deleteChat,
  findChats,
  findOneChat,
  getRecentlyChats,
  updateChat,
} from './chats.service'

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
  findOne: protectedProcedure
    .input(z.string().regex(/^[0-9A-Za-z]{12}$/))
    .query(findOneChat),
  delete: protectedProcedure
    .input(z.string().regex(/^[0-9A-Za-z]{12}$/))
    .mutation(deleteChat),
  update: protectedProcedure
    .input(
      z.object({
        chatId: z.string().regex(/^[0-9A-Za-z]{12}$/),
        label: z.string(),
      }),
    )
    .mutation(updateChat),
})
