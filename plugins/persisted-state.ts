import { CookieOptions } from 'nuxt/app'
import { type Pinia } from 'pinia'
import type { StorageLike } from 'pinia-plugin-persistedstate'
import { createPersistedState } from 'pinia-plugin-persistedstate'

function usePersistedstateCookies(
  cookieOptions?: Omit<CookieOptions<string>, 'encode' | 'decode'>,
) {
  return {
    getItem: (key: string) => {
      return useCookie<string>(key, {
        ...cookieOptions,
        encode: encodeURIComponent,
        decode: decodeURIComponent,
      }).value
    },
    setItem: (key, value) => {
      useCookie<string>(key, {
        ...cookieOptions,
        encode: encodeURIComponent,
        decode: decodeURIComponent,
      }).value = value
    },
  } as StorageLike
}

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as Pinia

  pinia.use(
    createPersistedState({
      storage: usePersistedstateCookies({}),
    }),
  )
})
