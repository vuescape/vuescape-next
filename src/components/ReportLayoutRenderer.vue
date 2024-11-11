<script lang="ts">
/**
 * ReportLayoutRenderer @component
 *
 * This is a Vue Single File Component (SFC) that renders a report layout into
 * three panes: left, center, and right.
 *
 * @prop {ReportLayout} reportLayout - the ReportLayout to render
 *
 */
export default {}
</script>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

import PaneLayoutView from './PaneLayoutRenderer.vue'

import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'

import type { ReportLayoutRendererProps } from '../models/componentProps/ReportLayoutRendererProps'

const props = defineProps<ReportLayoutRendererProps>()

// Set up reactive reportLayout that initializes from props and updates reactively
const reportLayout = ref(
  props.reportLayout || {
    id: 'null-report',
    title: '',
  }
)

// Watch for changes in props.reportLayout and update the local reportLayout ref
watch(
  () => props.reportLayout,
  (newReportLayout) => {
    if (newReportLayout) {
      reportLayout.value = newReportLayout
    }
  },
  { immediate: true, deep: true } // Syncs immediately on mount and responds to deep changes
)

// Calculate height offset based on title presence
const reportHeightOffset = computed(() => 136 + (reportLayout.value.title ? 30 : 0))

// Computed properties to check for the presence of panes with a positive width
const leftPaneExistsWithWidth = computed(() => 
  reportLayout.value.leftPane != null && reportLayout.value.leftPane.paneWidthPercent > 0
)
const rightPaneExistsWithWidth = computed(() => 
  reportLayout.value.rightPane != null && reportLayout.value.rightPane.paneWidthPercent > 0
)
const centerPaneExistsWithWidth = computed(() => 
  reportLayout.value.centerPane != null && reportLayout.value.centerPane.paneWidthPercent > 0
)
const isOnlyCenterPane = computed(() => 
  !leftPaneExistsWithWidth.value && !rightPaneExistsWithWidth.value && centerPaneExistsWithWidth.value
)

</script>

<template>
  <h3>{{ reportLayout.title }}</h3>
  <PaneLayoutView v-if="isOnlyCenterPane" :pane="reportLayout.centerPane!" />
  <Splitter v-else :style="`height: calc(100vh - ${reportHeightOffset}px)`">
    <SplitterPanel
      v-if="leftPaneExistsWithWidth"
      :size="reportLayout.leftPane?.paneWidthPercent"
    >
      <PaneLayoutView :pane="reportLayout.leftPane!" />
    </SplitterPanel>
    <SplitterPanel
      v-if="centerPaneExistsWithWidth"
      :size="reportLayout.centerPane?.paneWidthPercent"
    >
      <PaneLayoutView :pane="reportLayout.centerPane!" />
    </SplitterPanel>
    <SplitterPanel
      v-if="rightPaneExistsWithWidth"
      :size="reportLayout.rightPane?.paneWidthPercent"
    >
      <PaneLayoutView :pane="reportLayout.rightPane!" />
    </SplitterPanel>
  </Splitter>
</template>

<style>
.report-layout {
  display: flex;
}
</style>
