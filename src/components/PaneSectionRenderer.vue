<script lang="ts">
/**
 * PaneSectionRenderer @component
 *
 * This is a Vue Single File Component (SFC) that renders a section of a pane.
 *
 * @prop {PaneSection} section - the PaneSection to render
 *
 */
export default {}
</script>

<script setup lang="ts">
import type { PaneSectionRendererProps } from '../models/componentProps/PaneSectionRendererProps'
import PaneItemView from './PaneItemRenderer.vue'

const props = defineProps<PaneSectionRendererProps>()
</script>

<template>
  <div class="pane-section">
    <PaneItemView
      v-for="(item, index) in props.section.items"
      :key="`pane-section-item_${index}`"
      :item="item"
    />
  </div>
</template>

<style>
.pane-section {
  margin-bottom: 1rem;
}
</style>
