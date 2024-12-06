<script lang="ts">
/**
 * VuescapeButton @component
 *
 * This is a Vue Single File Component (SFC) that renders a button with an optional icon.
 *
 * @prop {VuescapeButtonProps} - the VuescapeButtonProps
 *
 * @emits {click} - the click event for the parent to handle
 */
export default {}
</script>

<script lang="ts" setup>
import Button from 'primevue/button'
import type { IconPosition } from '../models/componentProps/IconPosition'
import type { VuescapeButtonProps } from '../models/componentProps/VuescapeButtonProps'

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
