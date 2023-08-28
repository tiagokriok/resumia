import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email().trim(),
  password: z.string(),
  name: z.string().trim(),
})

export type RegisterInput = z.infer<typeof registerSchema>
