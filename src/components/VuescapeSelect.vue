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
import { onMounted, ref, useAttrs } from 'vue'
import { useRouter } from 'vue-router'

import type { VuescapeSelectProps } from '../models/componentProps/VuescapeSelectProps'
import {
  getSourcePaneKind,
  handleAction,
  handleNavigationAction
} from '../models/dynamic-ui/actions/ActionHandlers'
import type { NavigationAction } from '../models/dynamic-ui/actions/NavigationAction'
import type { SelectOption } from '../models/dynamic-ui/SelectOption'
import { useActionStore } from '../stores/useActionStore'

const actionStore = useActionStore()
const router = useRouter()

const props = defineProps<VuescapeSelectProps>()
const initializedProps = ref<VuescapeSelectProps>({
  options: props.options ?? [],
  selectedValue: props.selectedValue,
  onChangeAction: props.onChangeAction,
  name: props.name ?? '',
  placeholder: props.placeholder ?? 'Select an Item',
  disabled: props.disabled ?? false,
  cssClass: props.cssClass ?? ''
})

const mySelect = ref(null)
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
const handleChange = (event: Event) => {
  if (initializedProps.value.onChangeAction) {
    // This handler will not load a report but instead will simply navigate to a new route.
    const loadReport = async (url: string) => {}
    if (initializedProps.value.onChangeAction.type === 'selectNavigate') {
      if (!initializedProps.value.selectedValue) {
        console.warn('No selected value to navigate to')
        return
      }
      // Sometimes event can be wrap the original event.
      const selectedOption = event as unknown as { value: SelectOption }
      const eventToUse = (event as unknown as any).originalEvent ?? event
      const sourcePaneKind = getSourcePaneKind(eventToUse)
      const navigationAction: NavigationAction = {
        type: 'navigate',
        payload: {
          url: selectedOption.value.id,
          target: initializedProps.value.onChangeAction.payload.target
        }
      }
      handleNavigationAction(navigationAction, sourcePaneKind, router, loadReport)
    } else {
      handleAction(actionStore, router, loadReport)
    }
  } else {
    emit('change', event)
  }
}

onMounted(() => {
  debugger
  if (mySelect.value && props.onChangeAction && props.selectedValue?.id) {
    const mySelectValue = mySelect.value as any

    // Get the root HTML element of the Select component
    const selectElement = mySelectValue.$el || mySelectValue.$refs.input

    if (selectElement) {
      // Create a custom Event object
      const customEvent = new Event('change', {
        bubbles: true,
        cancelable: true
      })

      // Set the target to the HTML select element
      Object.defineProperty(customEvent, 'target', {
        value: selectElement
      })
      // Set the target to the HTML select element
      Object.defineProperty(customEvent, 'value', {
        value: { id: props.selectedValue.id }
      })

      // Emit the custom event
      mySelectValue.$emit('change', customEvent)
    }
  }
})
</script>

<template>
  <!-- do we need card flex here or should it just be the bare component? -->
  <div class="card flex">
    <Select
      ref="mySelect"
      :name="initializedProps.name"
      :model-value="initializedProps.selectedValue"
      :options="initializedProps.options"
      :placeholder="initializedProps.placeholder"
      option-label="displayName"
      class="my-class"
      :class="initializedProps.cssClass"
      :disabled="initializedProps.disabled"
      v-bind="attrs"
      v-on="listeners"
      @change="handleChange"
    >
    </Select>
  </div>
</template>

<style scoped></style>
