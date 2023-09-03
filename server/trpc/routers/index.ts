import { authRouter } from '~/server/modules/auth/auth.router'
import { conversationRouter } from '~/server/modules/conversations/conversations.router'
import { fileRouter } from '~/server/modules/files/files.router'
import { router } from '../trpc'

export const appRouter = router({
  auth: authRouter,
  files: fileRouter,
  conversations: conversationRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
