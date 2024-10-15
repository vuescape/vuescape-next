import type { Ref } from 'vue'
import type { NotificationMessage } from '../models/NotificationMessage'

// Define an interface for the Notifications store
export interface NotificationStore {
  messages: Array<NotificationMessage> | Ref<Array<NotificationMessage>>
}
