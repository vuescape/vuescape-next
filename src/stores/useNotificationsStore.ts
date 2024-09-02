import type { NotificationMessage } from '@/types/NotificationMessage'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationsStore = defineStore('useNotificationsStore',
  () => {
    const messages = ref<Array<NotificationMessage>>([])

    return { messages }
  })
