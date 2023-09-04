import { z } from 'zod'

export const createFileSchema = z.object({
  label: z.string(),
  description: z.string().optional(),
  name: z.string(),
  type: z.enum(['image', 'video', 'audio', 'document']),
  mimeType: z.string(),
  size: z.number(),
})

export type CreateFileInput = z.infer<typeof createFileSchema>
