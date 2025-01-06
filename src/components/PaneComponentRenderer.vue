<script lang="ts" setup>
import type { Component } from 'vue'
import { ref, watch } from 'vue'
import { markRaw } from 'vue'
import type { PaneComponentRendererProps } from '../models/componentProps/PaneComponentRendererProps'
import type { PaneComponent } from '../models/dynamic-ui/pane-components/PaneComponent'

const props = defineProps<PaneComponentRendererProps>()

const componentMap: Record<PaneComponent['type'], () => Promise<{ default: Component }>> = {
  title: () => import('./TitleComponentRenderer.vue'),
  button: () => import('./VuescapeButton.vue'),
  chicletGrid: () => import('./ChicletGrid.vue'),
  table: () => import('./VuescapeTable.vue'),
  select: () => import('./VuescapeSelect.vue'),
  tableTabs: () => import('./TableTabs.vue')
}

const resolvedComponent = ref<Component | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

watch(
  () => props.component.type,
  async (newType) => {
    const importFn = componentMap[newType]
    if (importFn) {
      try {
        isLoading.value = true
        error.value = null
        const module = await importFn()
        resolvedComponent.value = markRaw(module.default)
      } catch (e) {
        console.error(`Error loading component type: ${newType}`, e)
        error.value = `Error loading component type: ${newType}`
        resolvedComponent.value = null
      } finally {
        isLoading.value = false
      }
    } else {
      console.warn(`Unsupported component type: '${newType}'`)
      error.value = `Unsupported component type: '${newType}'`
      resolvedComponent.value = null
      isLoading.value = false
    }
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="isLoading" v-loading="isLoading"></div>
  <div v-else-if="error">
    <div>{{ error }}</div>
  </div>
  <component v-else :is="resolvedComponent" v-bind="component.payload" />
</template>
