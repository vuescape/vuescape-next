import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { NotificationMessage } from '../models/NotificationMessage'

export const useNotificationStore = defineStore('useNotificationsStore', () => {
  const messages = ref<Array<NotificationMessage>>([])

  return { messages }
})
