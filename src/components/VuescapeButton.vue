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
  cssClass: '',
  outlined: false,
  size: 'default'
})

/**
 * This component currently uses a typed event model (e.g. `@change`, `@update`).
 * If this component is later used inside a dynamic wizard or needs to emit
 * `can-continue` or unified `update` events, it may be wrapped in a
 * wizard-specific variant (e.g., `WizardFileUpload.vue`) to keep the core
 * component agnostic of wizard behavior.
 */
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
    :class="[
      props.cssClass,
      { 'vuescape-button--with-icon': props.icon, 'vuescape-button--small': props.size === 'small' }
    ]"
    :disabled="props.disabled"
    :icon="props.icon"
    :iconPos="props.iconPos"
    :label="props.label"
    @click="handleClick"
    :outlined="outlined"
  />
</template>

<style scoped>
.vuescape-button--with-icon {
  margin-bottom: 1px;
}

/* Small size variant - applying to the component wrapper */
.vuescape-button--small {
  min-height: 1.5rem !important;
  height: 1.5rem !important;
  padding: 0 0.75rem !important;
  font-size: 0.875rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1 !important;
}

/* Target the PrimeVue button's internal label */
.vuescape-button--small :deep(.p-button-label) {
  font-size: 0.875rem !important;
  line-height: 1 !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  margin-bottom: 2px;
}
</style>
