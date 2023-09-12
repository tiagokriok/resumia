import { z } from 'zod'
import { publicProcedure, router } from '../../trpc/trpc'
import { forgotPassword, login, register, resetPassword } from './auth.service'
import { loginSchema, registerSchema } from './dto'

export const authRouter = router({
  register: publicProcedure.input(registerSchema).mutation(register),
  login: publicProcedure.input(loginSchema).mutation(login),
  forgotPassword: publicProcedure
    .input(z.string().email())
    .mutation(forgotPassword),
  resetPassword: publicProcedure
    .input(
      z
        .object({
          password: z.string().min(8),
          confirmPassword: z.string().min(8),
          rememberToken: z.string(),
        })
        .superRefine(({ confirmPassword, password }, ctx) => {
          if (password !== confirmPassword) {
            ctx.addIssue({
              code: 'custom',
              message: 'The passwords did not match',
            })
          }
        }),
    )
    .mutation(resetPassword),
})
