import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { NotificationMessage } from '../models/NotificationMessage'

/**
 * A Pinia store for managing notification messages.
 *
 * @returns {Object} The notification store containing:
 * - `messages` {Ref<Array<NotificationMessage>>} - A reactive array of notification messages.
 * - `addMessage` {(message: NotificationMessage) => void} - Adds a message unless an identical one is already displayed.
 */
export const useNotificationStore = defineStore('useNotificationsStore', () => {
  const messages = ref<Array<NotificationMessage>>([])

  /**
   * Adds a notification message unless a message with the same text and severity
   * is already in the store, preventing duplicate notifications from stacking up.
   *
   * @param message - The notification message to add.
   */
  const addMessage = (message: NotificationMessage) => {
    const isDuplicate = messages.value.some(
      (existing) => existing.text === message.text && existing.severity === message.severity
    )
    if (isDuplicate) {
      return
    }
    messages.value.push(message)
  }

  return { messages, addMessage }
})
