import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(8),
  name: z.string().trim(),
})

export type RegisterInput = z.infer<typeof registerSchema>
