import { searchSchema } from '../../../lib/types/Search'
import { protectedProcedure, router } from '../../trpc/trpc'
import UserService from './users.service'

export const userRouter = router({
  find: protectedProcedure.input(searchSchema).query(UserService.find),
})
