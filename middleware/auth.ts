import { AuthState } from '~/lib/types/Stores'

export default defineNuxtRouteMiddleware((to, from) => {
  console.info('Auth Middleware')
  const toast = useToast()

  if (to.meta.protected) {
    const authStore = useCookie('auth')

    if (!authStore.value) {
      console.info('Not Authenticated')
      toast.add({
        group: 'top-right',
        title: 'Unauthorized',
        text: 'You are not authorized to access this page',
        type: 'error',
      })
      return navigateTo('/app/login')
      return
    }

    const { isAuthenticated, user } = authStore.value as unknown as AuthState

    console.info('Protected Route')
    const roles = to.meta.roles as string[]
    console.info(`Roles - ${roles}`)

    if (isAuthenticated && roles?.includes(user?.role)) {
      console.info('Authenticated and Authorized')
      return
    } else if (isAuthenticated && !roles?.includes(user?.role)) {
      console.info('Not Authorized')
      toast.add({
        group: 'top-right',
        title: 'Forbidden',
        text: 'You are not authorized to access this page',
        type: 'error',
      })
      return navigateTo(from.fullPath)
    } else if (!isAuthenticated) {
      console.info('Not Authenticated')
      toast.add({
        group: 'top-right',
        title: 'Unauthorized',
        text: 'You are not authorized to access this page',
        type: 'error',
      })
      return navigateTo('/app/login')
    }
  } else {
    return
  }
})
