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
}
