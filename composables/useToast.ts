import { NotificationSchema } from '../lib/notiwind'

export function useToast() {
  const { $notify } = useNuxtApp()

  function add(toast: NotificationSchema, duration: number = 5000) {
    $notify(toast, duration)
  }
  return {
    add,
  }
}
