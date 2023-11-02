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
        id: z.string().cuid(),
        label: z.string(),
      }),
    )
    .mutation(createChat),
  findOne: protectedProcedure.input(z.string().cuid()).query(findOneChat),
  delete: protectedProcedure.input(z.string().cuid()).mutation(deleteChat),
  update: protectedProcedure
    .input(
      z.object({
        chatId: z.string().cuid(),
        label: z.string(),
      }),
    )
    .mutation(updateChat),
})
