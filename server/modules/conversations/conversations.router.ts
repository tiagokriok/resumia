import { searchSchema } from '~/lib/types/Search'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { findConversations, getRecentlyChats } from './conversations.service'

export const conversationRouter = router({
  find: protectedProcedure.input(searchSchema).query(findConversations),
  getRecentlyChats: protectedProcedure.query(getRecentlyChats),
})
