<script lang="ts">
/**
 * WizardNavigationButtons @component
 *
 * Renders wizard navigation buttons (previous, next, cancel) grouped by position.
 *
 * @emits {previous} - Emitted when the previous button is clicked
 * @emits {next} - Emitted when the next button is clicked
 * @emits {cancel} - Emitted when the cancel button is clicked
 */
export default {}
</script>

<script lang="ts" setup>
import type { WizardNavigationButtonsProps } from '../../models/componentProps/WizardNavigationButtonsProps'
import VuescapeButton from '../VuescapeButton.vue'

const props = defineProps<WizardNavigationButtonsProps>()

const emit = defineEmits<{ (e: 'previous' | 'next' | 'cancel'): void }>()

function handleButtonClick(type: 'previous' | 'next' | 'cancel') {
  emit(type)
}
</script>

<template>
  <div class="grid grid-cols-3 w-full items-center">
    <!-- Left position buttons -->
    <div class="flex gap-2 justify-start">
      <template v-for="button in props.buttonsByPosition.left" :key="button.type">
        <VuescapeButton
          :disabled="button.config.disabled"
          :label="button.config.label"
          :outlined="button.config.variant === 'outlined'"
          @click="handleButtonClick(button.type)"
        />
      </template>
    </div>

    <!-- Center position buttons -->
    <div class="flex gap-2 justify-center">
      <template v-for="button in props.buttonsByPosition.center" :key="button.type">
        <VuescapeButton
          :disabled="button.config.disabled"
          :label="button.config.label"
          :outlined="button.config.variant === 'outlined'"
          @click="handleButtonClick(button.type)"
        />
      </template>
    </div>

    <!-- Right position buttons -->
    <div class="flex gap-2 justify-end">
      <template v-for="button in props.buttonsByPosition.right" :key="button.type">
        <VuescapeButton
          :disabled="button.config.disabled"
          :label="button.config.label"
          :outlined="button.config.variant === 'outlined'"
          @click="handleButtonClick(button.type)"
        />
      </template>
    </div>
  </div>
</template>
