import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { NotificationMessage } from '../models/NotificationMessage'

/**
 * A Pinia store for managing notification messages.
 *
 * @returns {Object} The notification store containing:
 * - `messages` {Ref<Array<NotificationMessage>>} - A reactive array of notification messages.
 */
export const useNotificationStore = defineStore('useNotificationsStore', () => {
  const messages = ref<Array<NotificationMessage>>([])

  return { messages }
})
