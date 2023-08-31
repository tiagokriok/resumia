import { z } from 'zod'
import { protectedProcedure, router } from '../../trpc/trpc'
import { createFileSchema } from './dto'
import FileService from './files.service'

export const fileRouter = router({
  createPresignedUrl: protectedProcedure
    .input(createFileSchema)
    .mutation(FileService.createPresignedUrl),
  embedFile: protectedProcedure
    .input(z.string().regex(/^[0-9A-Za-z]{12}$/))
    .mutation(FileService.embedFile),
})
