import { z } from 'zod'
import { protectedProcedure, router } from '../../trpc/trpc'
import { createFileSchema } from './dto'
import { createFile, deleteFile, embedFile } from './files.service'

export const fileRouter = router({
  create: protectedProcedure.input(createFileSchema).mutation(createFile),
  embed: protectedProcedure
    .input(z.string().regex(/^[0-9A-Za-z]{12}$/))
    .mutation(embedFile),
  delete: protectedProcedure
    .input(z.string().regex(/^[0-9A-Za-z]{12}$/))
    .mutation(deleteFile),
})
