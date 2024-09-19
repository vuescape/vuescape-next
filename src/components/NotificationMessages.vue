<script lang="ts" setup>
import Message from 'primevue/message'
import { ref, watch } from 'vue'
import type { NotificationMessage } from '../types/NotificationMessage'

// Accept messages as a prop
const props = defineProps<{
  messages: Array<NotificationMessage>
}>()

const messages = ref([...props.messages])

const handleClose = (id: string, event: Event) => {
  // We are  managing the list of messages and not PrimeVue so stop the event from propagating
  emit('remove', id)
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
      :closable="true"
      :severity="msg.severity.toString()"
      class="mt-2 mb-2"
      @close="handleClose (msg.id, $event)"
    >
      {{ msg.text }}
    </Message>
  </div>
</template>
