import { z } from 'zod'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { findMessages } from './messages.service'

export const messageRouter = router({
  find: protectedProcedure
    .input(z.string().regex(/^[0-9A-Za-z]{12}$/))
    .query(findMessages),
})
