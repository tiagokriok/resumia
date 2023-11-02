import { z } from 'zod'

export const updateFileSchema = z.object({
  id: z.string().cuid(),
  label: z.string().optional(),
  description: z.string().optional(),
})

export type UpdateFileInput = z.infer<typeof updateFileSchema>
