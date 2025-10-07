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
import type { PaneItemRendererProps } from '../models/componentProps/PaneItemRendererProps'

import PaneComponentRenderer from './PaneComponentRenderer.vue'

const props = defineProps<PaneItemRendererProps>()
</script>

<template>
  <div
    class="flex flex-col justify-start"
    :style="{ width: item.width }"
    :class="[
      item.horizontalAlignment ? `justify-${item.horizontalAlignment}` : '',
      item.verticalAlignment ? `items-${item.verticalAlignment}` : ''
    ]"
  >
    <!-- Future Feature: Add support for nested components or recursive components -->
    <PaneComponentRenderer
      v-for="(component, index) in props.item.components"
      :key="`${component.typeName}-${index}`"
      :component="component"
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
