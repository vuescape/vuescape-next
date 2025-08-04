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
import type { SelectChangeEvent } from 'primevue/Select'
import Select from 'primevue/Select'
import { onMounted, ref, useAttrs } from 'vue'
import { useRouter } from 'vue-router'

import type { VuescapeSelectProps } from '../models/componentProps/VuescapeSelectProps'
import {
  getSourcePaneKind,
  handleActionAsync,
  handleNavigationActionAsync
} from '../models/dynamic-ui/actions/ActionHandlers'
import type { NavigationAction } from '../models/dynamic-ui/actions/NavigationAction'
import type { SelectOption } from '../models/dynamic-ui/SelectOption'
import { useActionStore } from '../stores/useActionStore'

const actionStore = useActionStore()
const router = useRouter()

const props = defineProps<VuescapeSelectProps>()
const initializedProps = ref<VuescapeSelectProps>({
  id: props.id ?? '',
  options: props.options ?? [],
  // options: [props.options[0]],
  selectedValue: props.selectedValue,
  onChangeAction: props.onChangeAction,
  name: props.name ?? '',
  placeholder: props.placeholder ?? 'Select an Item',
  disabled: props.disabled ?? false,
  cssClass: props.cssClass ?? ''
})

const mySelect = ref(null)

/**
 * This component currently uses a typed event model (e.g. `@change`, `@update`).
 * If this component is later used inside a dynamic wizard or needs to emit
 * `can-continue` or unified `update` events, it may be wrapped in a
 * wizard-specific variant (e.g., `WizardFileUpload.vue`) to keep the core
 * component agnostic of wizard behavior.
 */
const emit = defineEmits<{
  (evt: 'change', event: SelectChangeEvent): void
}>()

// Pass-through all attributes to the Select component;
// use type any since these could be any types.
const attrs: any = useAttrs()

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
      acc[key] = attrs[key]
      return acc
    },
    {} as Record<string, unknown>
  )

/**
 * Handles the change event for the select component.
 * If an onChangeAction is provided, that action is handled.
 * This component does not know how to load a report async so if that is a requirement, the caller
 * should handle the 'change' event to a load a report into the pane/location that they wish.
 *
 * @param event - The event object triggered by the change.
 */
const handleChangeAsync = async (event: SelectChangeEvent) => {
  if (initializedProps.value.onChangeAction) {
    // This handler will not load a report but instead will simply navigate to a new route.
    const loadReportAsync = async (url: string) => {}
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
      await handleNavigationActionAsync(navigationAction, sourcePaneKind, router, loadReportAsync)
    } else {
      await handleActionAsync(actionStore, router, loadReportAsync)
    }
  } else {
    emit('change', event)
  }
}

onMounted(async () => {
  if (
    mySelect.value &&
    initializedProps.value.onChangeAction &&
    initializedProps.value.selectedValue?.id &&
    router.currentRoute.value.path != initializedProps.value?.selectedValue?.id
  ) {
    // Use the router here -- this can result in duplciate api calls if /my-data
    //  only has one product and that call already returned the product info.
    await router.push(initializedProps.value.selectedValue.id)
  }
})
</script>

<template>
  <!-- do we need card flex here or should it just be the bare component? -->
  <div class="card flex">
    <Select
      v-show="initializedProps.options.length !== 1"
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
      @change="handleChangeAsync"
    >
    </Select>
    <div v-if="initializedProps.options.length === 1" class="single-option-text">
      For
      {{ initializedProps.selectedValue?.displayName ?? initializedProps.options[0].displayName }}
    </div>
  </div>
</template>

<style scoped>
.single-option-text {
  font-weight: 500;
  margin-right: 1rem;
}
</style>
