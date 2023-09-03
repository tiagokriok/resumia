import { searchSchema } from '~/lib/types/Search'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { find } from './conversations.service'

export const conversationRouter = router({
  find: protectedProcedure.input(searchSchema).query(find),
})
