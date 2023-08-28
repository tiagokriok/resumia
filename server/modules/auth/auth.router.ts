import AuthService from '../../modules/auth/auth.service'
import { publicProcedure, router } from '../../trpc/trpc'
import { loginSchema, registerSchema } from './dto'

export const authRouter = router({
  register: publicProcedure
    .input(registerSchema)
    .mutation(AuthService.register),
  login: publicProcedure.input(loginSchema).mutation(AuthService.login),
})
