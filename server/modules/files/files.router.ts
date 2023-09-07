import { z } from 'zod'
import { searchSchema } from '~/lib/types/Search'
import { protectedProcedure, router } from '../../trpc/trpc'
import { createFileSchema, updateFileSchema } from './dto'
import {
  createFile,
  deleteFile,
  embedFile,
  findFiles,
  updateFile,
} from './files.service'

export const fileRouter = router({
  create: protectedProcedure.input(createFileSchema).mutation(createFile),
  embed: protectedProcedure
    .input(z.string().regex(/^[0-9A-Za-z]{12}$/))
    .mutation(embedFile),
  delete: protectedProcedure
    .input(z.string().regex(/^[0-9A-Za-z]{12}$/))
    .mutation(deleteFile),
  find: protectedProcedure.input(searchSchema).query(findFiles),
  update: protectedProcedure.input(updateFileSchema).mutation(updateFile),
})
