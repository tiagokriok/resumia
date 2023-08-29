import { useAuthStore } from '../stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  console.info('Main Middleware')
  const authStore = useAuthStore()

  if (to.fullPath.includes('login') && authStore.isAuthenticated) {
    console.info('Login isAuthenticated')
    return navigateTo('/app/workspaces', {
      replace: true,
    })
  } else if (to.fullPath.includes('login') && !authStore.isAuthenticated) {
    console.info('Not Authenticated')
    return
  }

  return
})
