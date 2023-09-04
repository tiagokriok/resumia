import { authRouter } from '~/server/modules/auth/auth.router'
import { chatRouter } from '~/server/modules/chats/chats.router'
import { fileRouter } from '~/server/modules/files/files.router'
import { router } from '../trpc'

export const appRouter = router({
  auth: authRouter,
  files: fileRouter,
  chats: chatRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
