<script setup lang="ts">
import VuescapeSelect from '../VuescapeSelect.vue'

import type { WizardSelectProps } from '../../models/componentProps/WizardSelectProps'
import type { SelectOption } from '../../models/dynamic-ui/SelectOption'
import type { WizardComponentEmits } from '../../models/wizard/WizardComponentEmits'
import { onActivated } from 'vue'

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

onActivated(() => {
  emit('can-continue', !!props.selectProps.selectedValue)
})
</script>

<template>
  <div class="flex min-w-[300px] flex-col items-center">
    <h3 class="mt-4">{{ props.title }}</h3>
    <p class="mb-3 text-center">{{ props.promptText }}</p>
    <VuescapeSelect v-bind="props.selectProps" @change="onItemChange" />
  </div>
</template>

<style scoped></style>
