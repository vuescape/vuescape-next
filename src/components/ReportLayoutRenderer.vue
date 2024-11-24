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
import { ref, watch, computed, onMounted } from 'vue'

import PaneLayoutRenderer from './PaneLayoutRenderer.vue'

import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'

import type { ReportLayoutRendererProps } from '../models/componentProps/ReportLayoutRendererProps'
import { ReportPaneKind } from '../models/feature/'
import type { ReportLayout } from '../models'

const props = defineProps<ReportLayoutRendererProps>()

// Set up reactive reportLayout that initializes from props and updates reactively
const reportLayouts = ref(
  props.reportLayouts || [
    {
      id: 'null-report',
      title: '',
      paneTarget: ReportPaneKind.CenterPane,
      content: null
    }
  ]
)

const validateReportLayouts = (reportLayouts: Array<ReportLayout>) => {
  const paneKinds = new Set<ReportPaneKind>()

  for (const layout of reportLayouts) {
    if (layout.targetPane && paneKinds.has(layout.targetPane)) {
      throw new Error(`Duplicate pane target found: ${layout.targetPane}`)
    }
    if (layout.targetPane) {
      paneKinds.add(layout.targetPane)
    }
  }
}

// Watch for changes in props.reportLayout and update the local reportLayout ref
watch(
  () => props.reportLayouts,
  (newReportLayouts) => {
    if (newReportLayouts) {
      validateReportLayouts(newReportLayouts)
      reportLayouts.value = newReportLayouts
    }
  },
  { immediate: true, deep: true } // Syncs immediately on mount and responds to deep changes
)

// Computed properties to check for the presence of panes with a positive width
const leftReportLayout = computed(() =>
  reportLayouts.value.find((layout) => layout.targetPane === ReportPaneKind.LeftPane)
)
const centerReportLayout = computed(() =>
  reportLayouts.value.find((layout) => layout.targetPane === ReportPaneKind.CenterPane)
)

const rightReportLayout = computed(() =>
  reportLayouts.value.find((layout) => layout.targetPane === ReportPaneKind.RightPane)
)

const leftPaneExistsWithWidth = computed(
  () => (leftReportLayout.value?.paneWidthPercent ?? 0) > 0
)
const centerPaneExistsWithWidth = computed(
  () => (centerReportLayout.value?.paneWidthPercent ?? 0) > 0
)
const rightPaneExistsWithWidth = computed(
  () => (rightReportLayout.value?.paneWidthPercent ?? 0) > 0
)

const isOnlyCenterPane = computed(
  () =>
    !leftPaneExistsWithWidth.value &&
    !rightPaneExistsWithWidth.value &&
    centerPaneExistsWithWidth.value
)

onMounted(() => {
  let title
  const centerReportLayout = reportLayouts.value.find(
    (layout) => layout.targetPane === ReportPaneKind.CenterPane
  )
  const leftReportLayout = reportLayouts.value.find(
    (layout) => layout.targetPane === ReportPaneKind.LeftPane
  )
  const rightReportLayout = reportLayouts.value.find(
    (layout) => layout.targetPane === ReportPaneKind.RightPane
  )

  if (centerReportLayout?.title) {
    title = centerReportLayout.title
  } else if (leftReportLayout?.title) {
    title = leftReportLayout.title
  } else if (rightReportLayout?.title) {
    title = rightReportLayout.title
  }

  if (title) {
    document.title = title
  }
})
</script>

<template>
  <!-- <h3>{{ reportLayout.title }}</h3> -->
  <PaneLayoutRenderer
  :data-paneKind="ReportPaneKind.CenterPane"
    :class="ReportPaneKind.CenterPane"
    v-if="isOnlyCenterPane && centerReportLayout?.content"
    :pane="centerReportLayout.content"
  />
  <!-- TODO: replace style with class -->
  <Splitter v-else style="height: 100vh">
    <SplitterPanel
      v-if="leftPaneExistsWithWidth && leftReportLayout?.content"
      :size="leftReportLayout.paneWidthPercent"
    >
      <PaneLayoutRenderer :data-paneKind="ReportPaneKind.LeftPane" :class="ReportPaneKind.LeftPane" :pane="leftReportLayout.content" />
    </SplitterPanel>
    <SplitterPanel
      v-if="centerPaneExistsWithWidth && centerReportLayout?.content"
      :size="centerReportLayout.paneWidthPercent"
    >
      <PaneLayoutRenderer :class="ReportPaneKind.CenterPane" :data-paneKind="ReportPaneKind.CenterPane" :pane="centerReportLayout.content" />
    </SplitterPanel>
    <SplitterPanel
      v-if="rightPaneExistsWithWidth && rightReportLayout?.content"
      :size="rightReportLayout.paneWidthPercent"
    >
      <PaneLayoutRenderer :class="ReportPaneKind.RightPane" :data-paneKind="ReportPaneKind.RightPane" :pane="rightReportLayout.content" />
    </SplitterPanel>
  </Splitter>
</template>

<style>
.report-layout {
  display: flex;
}
</style>
