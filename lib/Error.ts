import { TRPCClientError } from '@trpc/client'
import { TRPCError } from '@trpc/server'
import { ZodError } from 'zod'
import { useToast } from '../composables/useToast'
import { useAuthStore } from '../stores/auth'

export function errorHandler(error: any) {
  try {
    const authStore = useAuthStore()
    const toast = useToast()
    let text = 'Something went wrong'

    if (error instanceof ZodError) {
      const zError = error.flatten()
      text = Object.keys(zError.fieldErrors)
        .map((key) => `${key}: ${zError.fieldErrors[key]}`)
        .join('\n')
    } else if (error instanceof TRPCError) {
      const { message } = error
      text = message || 'Something went wrong'
    } else if (error instanceof TRPCClientError) {
      const { message, data } = error
      if (data?.httpStatus === 401 || data?.code === 'UNAUTHORIZED') {
        toast.add({
          group: 'top-right',
          title: 'Error',
          text: message,
          type: 'error',
        })
        authStore.logout()
        return navigateTo('/app/login')
      }
      text = message
    }
    toast.add({
      group: 'top-right',
      title: 'Error',
      text,
      type: 'error',
    })
    console.error(error)
  } catch (e) {
    console.error(e)
  }
}
