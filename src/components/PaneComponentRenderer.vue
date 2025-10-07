<script lang="ts" setup>
import type { Component } from 'vue'
import { markRaw, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import type { PaneComponentRendererProps } from '../models/componentProps/PaneComponentRendererProps'
import type { FileUploadComponentPayload } from '../models/dynamic-ui/pane-components/FileUploadComponentPayload'
import type { PaneComponent } from '../models/dynamic-ui/pane-components/PaneComponent'
import type { SelectComponentPayload } from '../models/dynamic-ui/pane-components/SelectComponentPayload'

// Props
const props = defineProps<PaneComponentRendererProps>()

const emit = defineEmits<{
  (e: 'update', id: string, payload: any): void
}>()

const router = useRouter()

// Track if this component is still valid for the current route context
const isActive = ref(true)
const currentRoute = ref(router.currentRoute.value.path)

// Watch for route changes and mark component as inactive if route changes
watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    if (newPath !== currentRoute.value) {
      isActive.value = false
    }
  }
)

// Load the initial component on mount
onMounted(async () => {
  if (isActive.value) {
    // Trigger the watch manually for initial load
    await loadComponentType(props.component.typeName)
  }
})

onUnmounted(() => {
  isActive.value = false
})

/**
 * A map of component "type" to an async import function.
 * These are still lazily loaded, so initial bundle size stays smaller.
 */
const componentMap: Record<PaneComponent['typeName'], () => Promise<{ default: Component }>> = {
  'component.text': () => import('./TextComponentRenderer.vue'),
  'component.button': () => import('./VuescapeButton.vue'),
  'component.chicletGrid': () => import('./ChicletGrid.vue'),
  'component.fileUpload': () => import('./FileUpload.vue'),
  'component.readOnlyFileUpload': () => import('./ReadOnlyFileUpload.vue'),
  'component.table': () => import('./VuescapeTable.vue'),
  'component.select': () => import('./VuescapeSelect.vue'),
  'component.tableTabs': () => import('./TableTabs.vue'),
  'component.textLink': () => import('./TextLinkComponent.vue')
}

/**
 * A cache to store either:
 * - A **Promise** for a module that's in the process of loading, or
 * - A **Component** that has finished loading.
 * Note: We cache by component type only, not by instance, since components are stateless templates.
 * The actual data/props differentiate instances.
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
 * Loads a component by type, handling caching and error states.
 */
async function loadComponentType(newType: PaneComponent['typeName']) {
  // Don't process component changes if this renderer is no longer active for the current route
  if (!isActive.value) {
    return
  }

  if (!componentMap[newType]) {
    // Type not in our map
    console.warn(`Unsupported component typeName: '${newType}'`)
    error.value = `Unsupported component typeName: '${newType}'`
    resolvedComponent.value = null
    return
  }

  // If we already have a cached "final" component, use it right away.
  if (typeof moduleCache[newType] === 'object' && 'setup' in (moduleCache[newType] as Component)) {
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
    // it's a Component, so reassign it directly.
    else {
      resolvedComponent.value = moduleCache[newType] as Component
    }
  } catch (e) {
    console.error(`Error loading component typeName: ${newType}`, e)
    error.value = `Error loading component typeName: '${newType}'`
    resolvedComponent.value = null
  }
}

/**
 * Watch the "component.type" for changes.
 * - If we have it cached, return it immediately.
 * - Otherwise, dynamically import it and store in cache.
 */
watch(
  () => props.component.typeName,
  async (newType) => {
    await loadComponentType(newType)
  },
  {
    flush: 'post' // Wait for DOM updates to complete before firing
    // Removed immediate: true to prevent firing during component transitions
  }
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
  onComponentUpdate('component.fileUpload', payload)
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
 * Generic handler for component updates
 * Emits standardized update events for all component types
 */
function onComponentUpdate(componentType: PaneComponent['typeName'], payload: any) {
  let id = ''
  let compositePayload: any = {}
  if (componentType === 'component.fileUpload') {
    const fileUploadPayload = props.component.payload as FileUploadComponentPayload
    id = fileUploadPayload.id
    compositePayload = {
      componentType,
      ...payload
    }
  } else if (componentType === 'component.select') {
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
    :key="`${component.typeName}-${JSON.stringify(component.payload)}`"
    v-bind="component.payload"
    @files-changed="onFilesChanged"
  />
  <!-- TODO: Add other event listeners above as needed -->
</template>
