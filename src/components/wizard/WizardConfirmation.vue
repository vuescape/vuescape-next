<script setup lang="ts">
import { Checkbox } from 'primevue'
import { computed, onActivated, ref, watch } from 'vue'
import type { WizardConfirmationProps } from '../../models/componentProps/WizardConfirmationProps'
import type { WizardComponentEmits } from '../../models/wizard/WizardComponentEmits'

const emit = defineEmits<WizardComponentEmits<boolean>>()

const props = defineProps<WizardConfirmationProps>()

const confirmationCheckboxValue = ref<Array<string>>([])

const isConfirmed = computed(() => confirmationCheckboxValue.value.includes('isConfirmed'))

watch(isConfirmed, (newValue) => {
  emit('update', newValue)
  emit('can-continue', newValue)
})

onActivated(() => {
  emit('can-continue', isConfirmed.value)
})

emit('update', isConfirmed.value)
</script>

<template>
  <div
    class="flex flex-col rounded-lg shadow-lg overflow-hidden mx-auto"
    style="
      background: var(--p-content-background);
      border: 1px solid var(--p-content-border-color);
    "
  >
    <!-- Dialog Header -->
    <div
      v-if="props.title"
      class="px-6 py-4 border-b"
      style="
        background: var(--p-surface-50);
        border-color: var(--p-content-border-color);
      "
    >
      <h3 class="text-xl font-semibold text-center m-0" style="color: var(--p-text-color)">
        {{ props.title }}
      </h3>
    </div>

    <!-- Dialog Content -->
    <div class="px-6 py-5 flex-grow">
      <div class="text-base leading-relaxed" style="color: var(--p-text-color)" v-html="props.messageHtml"></div>
    </div>

    <!-- Dialog Footer with Checkbox -->
    <div
      class="px-6 py-4 border-t"
      style="
        background: var(--p-surface-50);
        border-color: var(--p-content-border-color);
      "
    >
      <div class="flex items-center">
        <Checkbox v-model="confirmationCheckboxValue" value="isConfirmed" inputId="confirmation" />
        <label for="confirmation" class="ml-3 text-base font-medium cursor-pointer" style="color: var(--p-text-color)">{{
          props.confirmationCheckboxLabel ?? 'Click to continue'
        }}</label>
      </div>
    </div>
  </div>
</template>
