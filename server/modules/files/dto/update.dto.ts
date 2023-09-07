import { z } from 'zod'

export const updateFileSchema = z.object({
  id: z.string().regex(/^[0-9A-Za-z]{12}$/),
  label: z.string().optional(),
  description: z.string().optional(),
})

export type UpdateFileInput = z.infer<typeof updateFileSchema>
