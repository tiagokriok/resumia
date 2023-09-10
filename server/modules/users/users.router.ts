import { searchSchema } from '~/lib/types/Search'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { findUsers } from './users.service'

export const userRouter = router({
  find: protectedProcedure.input(searchSchema).query(findUsers),
})
