import { protectedProcedure, router } from '../../trpc/trpc'
import { createFileSchema } from './dto'
import FileService from './files.service'

export const fileRouter = router({
  createPresignedUrl: protectedProcedure
    .input(createFileSchema)
    .mutation(FileService.createPresignedUrl),
})
