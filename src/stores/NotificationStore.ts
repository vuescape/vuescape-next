import type { Ref } from 'vue'
import type { NotificationMessage } from '../models/NotificationMessage'

/**
 * Interface representing a store for notifications.
 */
export interface NotificationStore {
  /**
   * An array of notification messages or a reference to an array of notification messages.
   */
  messages: Array<NotificationMessage> | Ref<Array<NotificationMessage>>

  /**
   * Adds a notification message unless a message with the same text and severity
   * already exists in the store.
   */
  addMessage: (message: NotificationMessage) => void
}
