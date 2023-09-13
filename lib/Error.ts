import { TRPCClientError } from '@trpc/client'
import { TRPCError } from '@trpc/server'
import { ZodError } from 'zod'
import { useToast } from '../composables/useToast'
import { useAuthStore } from '../stores/auth'

export function errorHandler(error: TRPCError | ZodError | Error | unknown) {
  try {
    const nuxt = useNuxtApp()
    const authStore = useAuthStore(nuxt.$pinia)
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
    } else if (error instanceof Error) {
      const { name } = error

      if (name === 'TRPCClientError') {
        const { shape } = error as unknown as { shape: { message: string } }

        if (shape.message) {
          const shapeMessage = JSON.parse(shape.message)

          text = shapeMessage[0].message
        } else {
          text = error.message
        }
      }
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
