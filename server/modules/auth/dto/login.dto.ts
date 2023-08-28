import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(1, { message: 'Password is required' }),
})

export type LoginInput = z.infer<typeof loginSchema>
