<script lang="ts" setup>
import type { Component } from 'vue'
import { markRaw, ref, watch } from 'vue'

import type { PaneComponentRendererProps } from '../models/componentProps/PaneComponentRendererProps'
import type { FileUploadComponentPayload } from '../models/dynamic-ui/pane-components/FileUploadComponentPayload'
import type { PaneComponent } from '../models/dynamic-ui/pane-components/PaneComponent'
import type { SelectComponentPayload } from '../models/dynamic-ui/pane-components/SelectComponentPayload'

// Props
const props = defineProps<PaneComponentRendererProps>()

const emit = defineEmits<{
  (e: 'update', id: string, payload: any): void
}>()

/**
 * A map of component "type" to an async import function.
 * These are still lazily loaded, so initial bundle size stays smaller.
 */
const componentMap: Record<PaneComponent['type'], () => Promise<{ default: Component }>> = {
  text: () => import('./TextComponentRenderer.vue'),
  button: () => import('./VuescapeButton.vue'),
  chicletGrid: () => import('./ChicletGrid.vue'),
  fileUpload: () => import('./FileUpload.vue'),
  readOnlyFileUpload: () => import('./ReadOnlyFileUpload.vue'),
  table: () => import('./VuescapeTable.vue'),
  select: () => import('./VuescapeSelect.vue'),
  tableTabs: () => import('./TableTabs.vue'),
  textLink: () => import('./TextLinkComponent.vue')
}

/**
 * A cache to store either:
 * - A **Promise** for a module that’s in the process of loading, or
 * - A **Component** that has finished loading.
 */
const moduleCache: Record<string, Promise<{ default: Component }> | Component | undefined> = {}

/**
 * The component we’ve resolved for the current type.
 * `null` means either loading or an error occurred (see below).
 */
const resolvedComponent = ref<Component | null>(null)

/**
 * Error messages if a load fails or an unsupported type is requested.
 */
const error = ref<string | null>(null)

/**
 * Watch the "component.type" for changes.
 * - If we have it cached, return it immediately.
 * - Otherwise, dynamically import it and store in cache.
 */
watch(
  () => props.component.type,
  async (newType) => {
    if (!componentMap[newType]) {
      // Type not in our map
      console.warn(`Unsupported component type: '${newType}'`)
      error.value = `Unsupported component type: '${newType}'`
      resolvedComponent.value = null
      return
    }

    // If we already have a cached "final" component, use it right away.
    if (
      typeof moduleCache[newType] === 'object' &&
      'setup' in (moduleCache[newType] as Component)
    ) {
      error.value = null
      resolvedComponent.value = moduleCache[newType] as Component
      return
    }

    // If we have a cached Promise, re-use it. Otherwise, call the import fn now.
    if (!moduleCache[newType]) {
      moduleCache[newType] = componentMap[newType]() // store the Promise
    }

    try {
      error.value = null

      // If moduleCache[newType] is a Promise, await it.
      if (moduleCache[newType] instanceof Promise) {
        const module = await moduleCache[newType]
        const component = markRaw(module.default)
        // Cache the final component so future calls are instant.
        moduleCache[newType] = component
        resolvedComponent.value = component
      }
      // If moduleCache[newType] was already resolved between the check above and now,
      // it’s a Component, so reassign it directly.
      else {
        resolvedComponent.value = moduleCache[newType] as Component
      }
    } catch (e) {
      console.error(`Error loading component type: ${newType}`, e)
      error.value = `Error loading component type: '${newType}'`
      resolvedComponent.value = null
    } finally {
    }
  },
  { immediate: true }
)

/*
 * Handles changes to the selected files.
 * Manually emitting an event to the parent component when files are changed
 * This is to ensure that the parent component can react to file changes in the child component.
 * Currently, this is only used in the FileUpload component interacting with the Wizard component.
 * Other components may need to have an id passed in to the payload as well so that the data payload
 * can be mapped to the correct data item when submitting the wizard (e.g. survey field key).
 *
 * @param payload - An object containing:
 *   - isValid: Indicates whether the selected files are valid.
 *   - files: An array of File objects representing the selected files.
 */
function onFilesChanged(payload: { isValid: boolean; files: Array<File> }) {
  onComponentUpdate('fileUpload', payload)
}

// If these components and their handlers below are used in a survey with a wizard
// then we will need an ID to correlate their data into the survey step state.

/**
 * Handles select component changes
 */
// function onSelectionChanged(payload: { selectedValue: any }) {
//   onComponentUpdate('select', payload);
// }

/**
 * Handles text input component changes
 */
// function onTextChanged(payload: { value: string }) {
//   onComponentUpdate('textInput', payload);
// }

/**
 * Generic handler for component updates
 * Emits standardized update events for all component types
 */
function onComponentUpdate(componentType: string, payload: any) {
  let id = ''
  let compositePayload: any = {}
  if (componentType === 'fileUpload') {
    const fileUploadPayload = props.component.payload as FileUploadComponentPayload
    id = fileUploadPayload.id
    compositePayload = {
      componentType,
      ...payload
    }
  } else if (componentType === 'select') {
    const selectPayload = props.component.payload as SelectComponentPayload
    id = selectPayload.id
    compositePayload = {
      componentType,
      ...payload
    }
  } else {
    // Unsupported component type
    console.warn(`Unsupported component type for update: '${componentType}'`)
    return
  }

  emit('update', id, compositePayload)
}
</script>

<template>
  <!-- If there's an error, display it. -->
  <div v-if="error">{{ error }}</div>
  <!-- Otherwise, render the (cached) dynamically imported component. -->
  <component
    v-else
    :is="resolvedComponent"
    v-bind="component.payload"
    @files-changed="onFilesChanged"
  />
  <!-- TODO: Add other event listeners above as needed -->
</template>
