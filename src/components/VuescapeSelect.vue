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
import { useRouter } from 'vue-router'

import type { VuescapeSelectProps } from '../models/componentProps/VuescapeSelectProps'
import { handleAction } from '../models/dynamic-ui/actions/ActionHandlers'
import { useActionStore } from '../stores/useActionStore'

const actionStore = useActionStore()
const router = useRouter()

const props = defineProps<VuescapeSelectProps>()
const initializedProps = ref<VuescapeSelectProps>({
  options: props.options ?? [],
  value: props.value ?? {},
  onChangeAction: props.onChangeAction,
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
 * Excludes the 'onChange' attribute as it is handled separately.
 *
 * @param {Record<string, unknown>} attrs - The attributes object containing potential event listeners.
 * @param {Function} emit - The function used to emit events.
 * @returns {Record<string, (event: unknown) => void>} An object containing event listeners.
 */
const listeners = Object.keys(attrs)
  .filter((key) => key.startsWith('on') && key !== 'onChange')
  .reduce(
    (acc, key) => {
      const eventName = key.slice(2).toLowerCase()
      acc[eventName] = (event: unknown) => emit(eventName, event)
      return acc
    },
    {} as Record<string, (event: unknown) => void>
  )

/**
 * Handles the change event for the select component.
 * If an onChangeAction is provided, that action is handled.
 * This component does not know how to load a report async so if that is a requirement, the caller 
 * should handle the 'change' event to a load a report into the pane/location that they wish.
 *
 * @param event - The event object triggered by the change.
 */
const handleChange = (event: unknown) => {
  console.log('Handling change event:', event)
  if (initializedProps.value.onChangeAction) {
    // This handler will not load a report but instead will simply navigate to a new route.
    const loadReport = async (url: string) => {}
    handleAction(actionStore, router, loadReport)
  } else {
    emit('change', event)
  }
}
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
      @change="handleChange"
    >
    </Select>
  </div>
</template>

<style scoped></style>
