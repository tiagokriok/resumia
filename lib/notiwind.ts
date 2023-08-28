import {
  NotificationGroup,
  createNotifier,
  defineNotificationComponent,
} from 'notiwind'

export type NotificationSchema = {
  group: string
  title: string
  text?: string
  type: 'success' | 'error' | 'info' | 'warning' | 'general'
}

export const notify = createNotifier<NotificationSchema>()
export const Notification = defineNotificationComponent<NotificationSchema>()
export { NotificationGroup }
