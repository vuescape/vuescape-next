<script setup lang="ts">
import { Checkbox } from 'primevue'
import { ref, watch } from 'vue'
import type { WizardConfirmationProps } from '../../models/componentProps/WizardConfirmationProps'
import type { WizardComponentEmits } from '../../models/wizard/WizardComponentEmits'

const emit = defineEmits<WizardComponentEmits<boolean>>()

const props = defineProps<WizardConfirmationProps>()

const isConfirmed = ref(false)

watch(isConfirmed, (newValue) => {
  emit('update', newValue)
  emit('can-continue', newValue)
})

emit('update', isConfirmed.value)
</script>

<template>
  <div
    class="flex flex-column align-items-center justify-content-center text-center px-4 pb-4"
    style="min-height: 100%; border: 1px solid var(--p-primary-color); border-radius: 8px"
  >
    <div v-if="props.title" class="mt-2 text-xl font-semibold">{{ props.title }}</div>
    <div class="mt-2 mb-2 text-lg" v-html="props.messageHtml"></div>
    <div class="flex align-items-center">
      <Checkbox v-model="isConfirmed" value="isConfirmed" size="small" />
      <label for="confirmation" class="text-lg ml-2">{{
        props.confirmationCheckboxLabel ?? 'Click to continue'
      }}</label>
    </div>
  </div>
</template>
