import type { Ref } from 'vue'
import type { NotificationMessage } from '../types/NotificationMessage'

// Define an interface for the Notifications store
export interface NotificationStore {
  messages: Array<NotificationMessage> | Ref<Array<NotificationMessage>>
}
