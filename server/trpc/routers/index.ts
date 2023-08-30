import { fileRouter } from '~/server/modules/files/files.router'
import { authRouter } from '../../modules/auth/auth.router'
import { router } from '../trpc'

export const appRouter = router({
  auth: authRouter,
  files: fileRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
