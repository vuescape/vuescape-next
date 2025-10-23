<script lang="ts">
/**
 * NotificationMessages @component
 *
 * This is a Vue Single File Component (SFC) that displays notification messages as toasts
 * using PrimeVue's useToast service.
 *
 * @prop {Array<NotificationMessage>} messages - The list of messages to display as toasts
 */
export default {}
</script>

<script lang="ts" setup>
import type { ToastEvent } from 'primevue/toast'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import Message from 'primevue/message'
import type { NotificationMessage, NotificationMessagesProps } from '../models'

// Accept messages as a prop
const props = defineProps<NotificationMessagesProps>()
const emit = defineEmits<{
  (e: 'remove', id: string): void
}>()

const toast = useToast()

// Track displayed message IDs to avoid duplicates
const displayedMessageIds = new Set<string>()

// Track if Toast component is ready
const isToastReady = ref(false)

// Separate messages into closeable (toasts) and non-closeable (persistent messages)
const closeableMessages = computed(() => props.messages.filter((msg) => msg.closeable !== false))

const nonCloseableMessages = computed(() => props.messages.filter((msg) => msg.closeable === false))

/**
 * Handle toast close event
 */
const handleToastClose = (event: ToastEvent) => {
  const messageId = (event.message as { id: string })?.id
  if (!messageId) return

  // Remove from tracking
  displayedMessageIds.delete(messageId)
  emit('remove', messageId)
}

/**
 * Convert NotificationMessage to PrimeVue toast options
 */
const convertToToastOptions = (message: NotificationMessage) => {
  return {
    id: message.id,
    severity: message.severity,
    summary: message.text,
    detail: '', // Could be extended if NotificationMessage gets a detail field
    life: 0, // 0 = sticky/persistent - never auto-dismiss
    closable: message.closeable ?? true,
    group: 'notification-messages' // Position toasts at top-center
  }
}

/**
 * Display a message as a toast
 */
const showToast = (message: NotificationMessage) => {
  if (displayedMessageIds.has(message.id)) {
    return // Avoid duplicate toasts
  }

  if (!isToastReady.value) {
    return // Toast component not ready yet
  }

  const toastOptions = convertToToastOptions(message)
  toast.add(toastOptions)
  displayedMessageIds.add(message.id)
}

// Handle initial closeable messages when component is mounted
onMounted(async () => {
  // Wait for the next tick to ensure Toast component is fully rendered
  await nextTick()

  // Mark toast as ready
  isToastReady.value = true

  // Process initial closeable messages as toasts
  if (closeableMessages.value && closeableMessages.value.length > 0) {
    closeableMessages.value.forEach((message) => {
      if (!displayedMessageIds.has(message.id)) {
        showToast(message)
      }
    })
  }
})

// Watch for new closeable messages and display them as toasts
watch(
  closeableMessages,
  (newCloseableMessages: Array<NotificationMessage>) => {
    if (newCloseableMessages && newCloseableMessages.length > 0) {
      newCloseableMessages.forEach((message) => {
        if (!displayedMessageIds.has(message.id)) {
          showToast(message)
        }
      })
    }
  },
  { deep: true }
)

// Watch for when toast becomes ready and process any queued closeable messages
watch(isToastReady, (ready) => {
  if (ready && closeableMessages.value && closeableMessages.value.length > 0) {
    closeableMessages.value.forEach((message) => {
      if (!displayedMessageIds.has(message.id)) {
        showToast(message)
      }
    })
  }
})
</script>

<template>
  <!-- Toast component for closeable messages -->
  <Toast
    class="notification-messages-toast"
    position="top-center"
    group="notification-messages"
    style="width: 60rem; max-width: 100%; top: 40px"
    @close="handleToastClose"
  />

  <!-- Persistent messages for non-closeable messages -->
  <div v-if="nonCloseableMessages.length > 0">
    <Message
      v-for="message in nonCloseableMessages"
      :key="message.id"
      :severity="message.severity"
      class="mt-2 mb-2"
      :closable="false"
    >
      {{ message.text }}
    </Message>
  </div>
</template>

<style>
.notification-messages-toast .p-toast-message {
  margin-bottom: 8px;
}

/* Fix icon and close button alignment with text */
.notification-messages-toast .p-toast-message-content {
  align-items: center!important;
}
</style>
