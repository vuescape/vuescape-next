<script lang="ts">
/**
 * PaneComponentRenderer @component
 *
 * This is a Vue Single File Component (SFC) that dynamically renders a pane component passed in via props.
 *
 * @prop {PaneComponent} paneComponent - The pane component to render
 *
 */
export default {}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
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

const resolvedComponent = computed(() => {
  const importFn = componentMap[props.component.type]
  if (importFn) {
    return () => ({
      component: importFn(),
      loading: { template: '<div>Loading...</div>' },
      error: getUnsupportedComponent(props.component.type, 'Error loading component')
    })
  } else {
    return getUnsupportedComponent(props.component.type)
  }
})

function getUnsupportedComponent(type: string, error?: string) {
  console.warn(`Unsupported component type: '${type}'`, error)
  return {
    template: `<div>Component type not supported: '${type}' ${error ? error : ''}</div>`
  }
}
</script>

<template>
  <component :is="resolvedComponent" v-bind="component.payload" />
</template>
