import { useAuthStore } from '../stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  console.info('Main Middleware')
  const authStore = useAuthStore()

  if (to.fullPath.includes('login') && authStore.isAuthenticated) {
    console.info('Login isAuthenticated')
    if (authStore.user.role === 'sys_admin') {
      return navigateTo('/app/admin', {
        replace: true,
      })
    } else if (
      authStore.user.role === 'manager' ||
      authStore.user.role === 'owner'
    ) {
      return navigateTo('/app/backoffice', {
        replace: true,
      })
    } else if (authStore.user.role === 'staff') {
      return navigateTo('/app/my', {
        replace: true,
      })
    }
  } else if (to.fullPath.includes('login') && !authStore.isAuthenticated) {
    console.info('Not Authenticated')
    return
  }

  return
})
