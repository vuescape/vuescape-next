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
import type { NotificationMessage, NotificationMessagesProps } from '../models'

/**
 * This component currently uses a typed event model (e.g. `@change`, `@update`).
 * If this component is later used inside a dynamic wizard or needs to emit
 * `can-continue` or unified `update` events, it may be wrapped in a
 * wizard-specific variant (e.g., `WizardFileUpload.vue`) to keep the core
 * component agnostic of wizard behavior.
 */
const emit = defineEmits<{ (e: 'remove', id: string): void }>()

// Accept messages as a prop
const props = defineProps<NotificationMessagesProps>()
const messages = ref([...props.messages])

const handleClose = (msg: NotificationMessage, event: Event) => {
  if (msg.closeable === false) {
    return
  }

  // Emit the remove event with the message id so that it can be removed if desired
  emit('remove', msg.id)

  // We are  managing the list of messages and not PrimeVue so stop the event from propagating
  event.stopPropagation()
  event.preventDefault()
}

watch(
  () => props.messages,
  (newValue: Array<NotificationMessage>) => {
    messages.value = [...newValue]
  },
  { deep: true }
)
</script>

<template>
  <div>
    <Message
      v-for="message in messages"
      :key="message.id"
      :severity="message.severity"
      class="mt-2 mb-2"
      @close="handleClose(message, $event)"
      :closable="message.closeable ?? true"
    >
      {{ message.text }}
    </Message>
  </div>
</template>
