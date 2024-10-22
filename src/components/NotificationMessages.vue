<script lang="ts">
/**
 * NotificationMessage @component
 *
 * This is a Vue Single File Component (SFC) that displays a list of messages
 *
 * @prop {Array<NotificationMessage>} messages - The list of messages to display
 *
 * @emit remove: {id: string} - Event emitted when a message is removed
 */
export default {}
</script>

<script lang="ts" setup>
import Message from 'primevue/message'
import { ref, watch } from 'vue'
import type { NotificationMessage } from '../models/NotificationMessage'

// Accept messages as a prop
const props = defineProps<{
  messages: Array<NotificationMessage>
}>()

const messages = ref([...props.messages])

const handleClose = (msg: NotificationMessage, event: Event) => {
  if (msg.closeable === false) {
    return
  }

  // We are  managing the list of messages and not PrimeVue so stop the event from propagating
  emit('remove', msg.id)
  event.stopPropagation()
  event.preventDefault()
}

const emit = defineEmits<{ (e: 'remove', id: string): void }>()

watch(
  () => props.messages,
  (newValue: Array<NotificationMessage>) => {
    messages.value = [...newValue]
  }, { deep: true },
)

</script>

<template>
  <div>
    <Message
      v-for="msg in messages"
      :key="msg.id"
      :severity="msg.severity.toString()"
      class="mt-2 mb-2"
      @close="handleClose (msg, $event)"
      :closable="msg.closeable ?? true"
    >
      {{ msg.text }}
    </Message>
  </div>
</template>
