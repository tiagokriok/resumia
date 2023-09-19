import { AuthState } from '~/lib/types/Stores'

export default defineNuxtRouteMiddleware((to, from) => {
  console.info('Main Middleware')

  const authCookie = useCookie('auth')

  const authState = authCookie.value as unknown as AuthState

  if (to.fullPath.includes('login') && authState?.isAuthenticated) {
    console.info('Login isAuthenticated')
    return navigateTo('/app/workspaces', {
      replace: true,
    })
  } else if (to.fullPath.includes('login') && !authState?.isAuthenticated) {
    console.info('Not Authenticated')
    return
  }

  return
})
