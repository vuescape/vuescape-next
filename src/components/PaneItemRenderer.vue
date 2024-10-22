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
import type { PaneItem } from '../models/dynamic-ui/PaneItem'
import type { PaneComponent } from '../models/dynamic-ui/pane-components/PaneComponent'
import { defineProps } from 'vue'

// TODO: import the actual components
import TitleComponentView from './VuescapeButton.vue'
import ButtonComponentView from './VuescapeButton.vue'
import ChicletGridComponentView from './VuescapeButton.vue'
import TableComponentView from './VuescapeButton.vue'

const props = defineProps<{ item: PaneItem }>()

const componentMap: Record<PaneComponent['type'], any> = {
  title: TitleComponentView,
  button: ButtonComponentView,
  grid: ChicletGridComponentView,
  table: TableComponentView
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
      :component="component"
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
