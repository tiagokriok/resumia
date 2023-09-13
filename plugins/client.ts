import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client'
import { AuthState } from '~/lib/types/Stores'
import type { AppRouter } from '~/server/trpc/routers/index'

export default defineNuxtPlugin(() => {
  const headers = useRequestHeaders()

  /**
   * createTRPCNuxtClient adds a `useQuery` composable
   * built on top of `useAsyncData`.
   */
  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        headers(opts) {
          const authCookie = useCookie('auth')
          const authStore = authCookie.value as unknown as AuthState

          return {
            ...(authStore?.isAuthenticated && {
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
