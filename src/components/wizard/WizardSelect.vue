<script setup lang="ts">
import VuescapeSelect from '../VuescapeSelect.vue'

import type { WizardSelectProps } from '../../models/componentProps/WizardSelectProps'
import type { SelectOption } from '../../models/dynamic-ui/SelectOption'
import type { WizardComponentEmits } from '../../models/wizard/WizardComponentEmits'

const props = defineProps<WizardSelectProps>()
const emit = defineEmits<WizardComponentEmits<SelectOption | undefined>>()

function onItemChange(event: any) {
  const selected: SelectOption | undefined = event.value
  emit('update', selected)
  emit('can-continue', !!selected)
}

if (props.selectProps.selectedValue) {
  emit('update', props.selectProps.selectedValue)
  emit('can-continue', !!props.selectProps.selectedValue)
}
</script>

<template>
  <div class="flex flex-col items-center min-w-[300px]">
    <h3 class="mt-4">{{ props.title }}</h3>
    <p class="text-center mb-3">{{ props.promptText }}</p>
    <VuescapeSelect v-bind="props.selectProps" @change="onItemChange" />
  </div>
</template>

<style scoped></style>
