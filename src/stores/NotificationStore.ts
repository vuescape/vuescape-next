import type { NotificationMessage } from '../types/NotificationMessage'

// Define an interface for the Notifications store
export interface NotificationStore {
  messages: Array<NotificationMessage> // The array of notification messages
}
