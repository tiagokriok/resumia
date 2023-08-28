import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'
import type { AppRouter } from '../server/trpc/routers/index'
import { useAuthStore } from '../stores/auth'

export default defineNuxtPlugin(() => {
  const headers = useRequestHeaders()
  const authStore = useAuthStore()
  /**
   * createTRPCNuxtClient adds a `useQuery` composable
   * built on top of `useAsyncData`.
   */
  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        headers(opts) {
          return {
            ...(authStore.isAuthenticated && {
              Authorization: `Bearer ${authStore.access_token}`,
            }),
          }
        },
      }),
    ],
  })

  return {
    provide: {
      client,
    },
  }
})
