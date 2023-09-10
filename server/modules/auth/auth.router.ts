import { publicProcedure, router } from '../../trpc/trpc'
import { login, register } from './auth.service'
import { loginSchema, registerSchema } from './dto'

export const authRouter = router({
  register: publicProcedure.input(registerSchema).mutation(register),
  login: publicProcedure.input(loginSchema).mutation(login),
})
