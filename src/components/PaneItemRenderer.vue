<script lang="ts">
/**
 * PaneItemRenderer @component
 *
 * This is a Vue Single File Component (SFC) that renders a pane item passed in via props.
 *
 * @prop {PaneItem} item - The pane item to render
 *
 */
export default {}
</script>

<script setup lang="ts">
import type { PaneComponent } from '../models/dynamic-ui/pane-components/PaneComponent'

import ChicletGridComponentView from './ChicletGrid.vue'
import TitleComponentView from './TitleComponentRenderer.vue'
import ButtonComponentView from './VuescapeButton.vue'
// TODO: import the actual components
import TableTabsComponentView from './TableTabsComponent.vue'
import TableComponentView from './VuescapeButton.vue'
import SelectComponentView from './VuescapeSelect.vue'

// TODO: import the actual components

import type { PaneItemRendererProps } from '../models/componentProps/PaneItemRendererProps'

const props = defineProps<PaneItemRendererProps>()

const componentMap: Record<PaneComponent['type'], any> = {
  title: TitleComponentView,
  button: ButtonComponentView,
  chicletGrid: ChicletGridComponentView,
  table: TableComponentView,
  select: SelectComponentView,
  tableTabs: TableTabsComponentView
}
</script>

<template>
  <div
    class="pane-item p-d-flex p-flex-column"
    :style="{ width: item.width }"
    :class="[
      item.horizontalAlignment ? `p-jc-${item.horizontalAlignment}` : '',
      item.verticalAlignment ? `p-ai-${item.verticalAlignment}` : ''
    ]"
  >
    <component
      v-for="component in props.item.components"
      :key="component.type"
      :is="componentMap[component.type]"
      v-bind="component.payload"
    />
  </div>
</template>

<style>
.pane-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>
