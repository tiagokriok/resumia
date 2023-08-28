import Notifications, { createNotifier } from 'notiwind'
import { NotificationSchema } from '../lib/notiwind'
export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.use(Notifications)

  return {
    provide: {
      notify: createNotifier<NotificationSchema>(),
    },
  }
})
