<script lang="ts">
/**
 * VuescapeSelect @component
 *
 * This is a Vue Single File Component (SFC) that renders a Select
 *
 * @prop {VuescapeSelectProps} - the VuescapeSelectProps
 */
export default {}
</script>

<script lang="ts" setup>
import Select from 'primevue/Select'
import { ref, useAttrs } from 'vue'
import type { VuescapeSelectProps } from '../models/componentProps/VuescapeSelectProps'

debugger
const props = defineProps<VuescapeSelectProps>()
const initializedProps = ref<VuescapeSelectProps>({
  options: props.options ?? [],
  value: props.value ?? {},
  name: props.name ?? '',
  optionLabel: props.optionLabel ?? 'name',
  placeholder: props.placeholder ?? 'Select an Item',
  disabled: props.disabled ?? false,
  class: props.class ?? ''
})

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits()
const attrs = useAttrs()

/**
 * Creates an object containing event listeners from the provided attributes.
 *
 * @param {Record<string, unknown>} attrs - The attributes object containing potential event listeners.
 * @param {Function} emit - The function used to emit events.
 * @returns {Record<string, (event: unknown) => void>} An object containing event listeners.
 */
const listeners = Object.keys(attrs).reduce(
  (acc, key) => {
    if (key.startsWith('on')) {
      const eventName = key.slice(2).toLowerCase()
      acc[eventName] = (event: unknown) => emit(eventName, event)
    }
    return acc
  },
  {} as Record<string, (event: unknown) => void>
)
</script>

<template>
  <!-- do we need card flex here or should it just be the bare component? -->
  <div class="card flex">
    <Select
      :name="initializedProps.name"
      :model-value="initializedProps.value"
      :options="initializedProps.options"
      :placeholder="initializedProps.placeholder"
      :option-label="initializedProps.optionLabel"
      :class="initializedProps.class"
      :disabled="initializedProps.disabled"
      v-bind="attrs"
      v-on="listeners"
    >
    </Select>
  </div>
</template>

<style scoped></style>
