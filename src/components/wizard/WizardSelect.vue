<script setup lang="ts">
import { ref } from 'vue'
import VuescapeSelect from '../VuescapeSelect.vue'
// Adjust the import path to wherever your VuescapeSelect component is located.

import type { SelectOption } from '../../models/dynamic-ui/SelectOption'
import type { WizardSelectProps } from '../../models/componentProps/WizardSelectProps'

// Receive an optional list of companies from the parent.
const props = defineProps<WizardSelectProps>()

// Emit the chosen company upward.
const emit = defineEmits(['change'])

// Local reactive state for the selected company.
const selectedItem = ref<SelectOption | undefined>(undefined)

/**
 * Handle the VuescapeSelect change event. The event object typically
 * includes the new selection in `event.value`.
 */
function onItemChange(event: any) {
  selectedItem.value = event.value
  // Inform parent wizard of new selection.
  emit('change', selectedItem.value)
}
</script>

<template>
  <div class="p-d-flex p-flex-column p-ai-center" style="min-width: 300px">
    <!-- Title -->
    <h3 class="p-mt-4">{{ title }}</h3>

    <!-- Prompt text -->
    <p class="p-text-center p-mb-3">{{ promptText }}</p>

    <!-- VuescapeSelect component -->
    <VuescapeSelect v-bind="props.selectProps" @change="onItemChange" />
  </div>
</template>

<style scoped></style>
