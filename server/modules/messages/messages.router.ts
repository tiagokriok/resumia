import { z } from 'zod'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { findMessages } from './messages.service'

export const messageRouter = router({
  find: protectedProcedure.input(z.string().cuid()).query(findMessages),
})
