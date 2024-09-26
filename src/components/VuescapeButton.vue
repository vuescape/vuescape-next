<script lang="ts" setup>
import Button from 'primevue/button'
import type { IconPosition, VuescapeButtonProps } from '../types/componentProps/VuescapeButtonProps'

const props = withDefaults(defineProps<VuescapeButtonProps>(), {
  label: 'Submit',
  icon: '',
  iconPos: '' as IconPosition,
  disabled: false,
  class: ''
})

const emit = defineEmits<{
  (e: 'click', event: Event): void
}>()

// Handle the click event and emit it to the parent
const handleClick = (event: Event) => {
  emit('click', event)
}
</script>

<template>
  <Button
    :class="[props.class, { 'vuescape-button--with-icon': props.icon }]"
    :disabled="props.disabled"
    :icon="props.icon"
    :iconPos="props.iconPos"
    :label="props.label"
    @click="handleClick"
  />
</template>

<style scoped>
.vuescape-button--with-icon {
  margin-bottom: 1px;
}
</style>
