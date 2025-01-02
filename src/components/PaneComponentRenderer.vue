<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { markRaw } from 'vue'
import type { PaneComponentRendererProps } from '../models/componentProps/PaneComponentRendererProps'
import type { PaneComponent } from '../models/dynamic-ui/pane-components/PaneComponent'

const props = defineProps<PaneComponentRendererProps>()

const componentMap: Record<PaneComponent['type'], any> = {
  title: () => import('./TitleComponentRenderer.vue'),
  button: () => import('./VuescapeButton.vue'),
  chicletGrid: () => import('./ChicletGrid.vue'),
  table: () => import('./VuescapeTable.vue'),
  select: () => import('./VuescapeSelect.vue'),
  tableTabs: () => import('./TableTabs.vue')
}

const resolvedComponent = ref<any>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

watchEffect(async () => {
  const importFn = componentMap[props.component.type]

  if (importFn) {
    try {
      isLoading.value = true
      error.value = null
      const module = await importFn()
      resolvedComponent.value = markRaw(module.default)
    } catch (e) {
      console.error(`Error loading component type: ${props.component.type}`, e)
      error.value = `Error loading component type: ${props.component.type}`
      resolvedComponent.value = null
    } finally {
      isLoading.value = false
    }
  } else {
    console.warn(`Unsupported component type: '${props.component.type}'`)
    error.value = `Unsupported component type: '${props.component.type}'`
    resolvedComponent.value = null
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading">
    <div>Loading...</div>
  </div>
  <div v-else-if="error">
    <div>{{ error }}</div>
  </div>
  <component v-else :is="resolvedComponent" v-bind="component.payload" />
</template>
