import { z } from 'zod'
import { searchSchema } from '~/lib/types/Search'
import { protectedProcedure, router } from '~/server/trpc/trpc'
import { updateUserSchema } from './dto'
import { findUsers, updateLanguage, updateProfile } from './users.service'

export const userRouter = router({
  find: protectedProcedure.input(searchSchema).query(findUsers),
  updateLanguage: protectedProcedure
    .input(z.enum(['en-US', 'es-ES', 'pt-BR']).default('en-US'))
    .mutation(updateLanguage),
  updateProfile: protectedProcedure
    .input(updateUserSchema)
    .mutation(updateProfile),
})
