export default defineNuxtRouteMiddleware((to, from) => {
  console.info('Main Middleware')

  const authCookie = useCookie('auth').value

  const authStore = authCookie && JSON.parse(authCookie)
  console.log('authStore', authStore)

  if (to.fullPath.includes('login') && authStore?.isAuthenticated) {
    console.info('Login isAuthenticated')
    return navigateTo('/app/workspaces', {
      replace: true,
    })
  } else if (to.fullPath.includes('login') && !authStore?.isAuthenticated) {
    console.info('Not Authenticated')
    return
  }

  return
})
