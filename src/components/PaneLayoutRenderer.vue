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
import type { PaneLayout } from '../models/dynamic-ui/PaneLayout'
import PaneSectionRenderer from './PaneSectionRenderer.vue'
import { defineProps } from 'vue'

const props = defineProps<{ pane: PaneLayout }>()
</script>

<template>
  <div :style="{ width: props.pane.paneWidthPercent + '%' }" class="pane-layout">
    <PaneSectionRenderer
      v-for="section in props.pane.sections"
      :key="section.id"
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
