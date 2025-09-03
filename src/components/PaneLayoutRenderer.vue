<script lang="ts">
/**
 * PaneLayoutRenderer @component
 *
 * This is a Vue Single File Component (SFC) that renders sections as part of a pane layout.
 *
 * @prop {PaneLayout} pane - the PaneLayout to render
 *
 */
export default {}
</script>

<script setup lang="ts">
import type { PaneLayoutRendererProps } from '../models/componentProps/PaneLayoutRendererProps'
import PaneSectionRenderer from './PaneSectionRenderer.vue'

defineProps<PaneLayoutRendererProps>()
</script>

<template>
  <div class="pane-layout">
    <PaneSectionRenderer
      v-for="section in pane.sections"
      :key="`${pane.id}-${section.id}`"
      :section="section"
    />
  </div>
</template>

<style>
.pane-layout {
  padding: 1rem;
  box-sizing: border-box;
}
</style>
