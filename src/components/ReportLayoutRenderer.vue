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

import PaneComponentRenderer from './PaneComponentRenderer.vue'
import PaneLayoutRenderer from './PaneLayoutRenderer.vue'

import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'

import type { ReportLayoutRendererProps } from '../models/componentProps/ReportLayoutRendererProps'
import { ReportPaneKind } from '../models/feature/'
import type { ReportLayout } from '../models'

const props = defineProps<ReportLayoutRendererProps>()

// Set up reactive reportLayout that initializes from props and updates reactively
const reportLayouts = ref<ReportLayout[]>(
  props.reportLayouts || [
    {
      id: 'null-report',
      title: '',
      targetPane: ReportPaneKind.CenterPane,
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

// Computed properties for each pane layout
const leftReportLayout = computed(() =>
  reportLayouts.value.find((layout) => layout.targetPane === ReportPaneKind.LeftPane)
)
const centerReportLayout = computed(() =>
  reportLayouts.value.find((layout) => layout.targetPane === ReportPaneKind.CenterPane)
)
const rightReportLayout = computed(() =>
  reportLayouts.value.find((layout) => layout.targetPane === ReportPaneKind.RightPane)
)

const actionButton = computed(() => {
  const result = centerReportLayout.value?.actionButton
  return result
})

// Computed properties checking if a specified pane exists and has > 0 width
const leftPaneExistsWithWidth = computed(() => (leftReportLayout.value?.paneWidthPercent ?? 0) > 0)
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

const reportDetail = computed(() => {
  let result

  if (centerReportLayout.value?.reportDetail) {
    result = centerReportLayout.value.reportDetail
  } else if (leftReportLayout.value?.reportDetail) {
    result = leftReportLayout.value.reportDetail
  } else if (rightReportLayout.value?.reportDetail) {
    result = rightReportLayout.value.reportDetail
  }

  return result
})

const pageTitle = computed(() => {
  let title

  if (centerReportLayout.value?.title) {
    title = centerReportLayout.value.title
  } else if (leftReportLayout.value?.title) {
    title = leftReportLayout.value.title
  } else if (rightReportLayout.value?.title) {
    title = rightReportLayout.value.title
  }

  return title
})

onMounted(() => {
  const title = pageTitle.value
  if (title) {
    document.title = title
  }
})
</script>

<template>
  <!-- <h3>{{ reportLayout.title }}</h3> -->
  <div v-if="reportDetail || actionButton" class="flex items-center justify-end gap-2">
    <span class="mr-2">{{ reportDetail }}</span>
    <PaneComponentRenderer :component="actionButton" v-if="actionButton"></PaneComponentRenderer>
  </div>
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
      <PaneLayoutRenderer
        :data-paneKind="ReportPaneKind.LeftPane"
        :class="ReportPaneKind.LeftPane"
        :pane="leftReportLayout.content"
      />
    </SplitterPanel>
    <SplitterPanel
      v-if="centerPaneExistsWithWidth && centerReportLayout?.content"
      :size="centerReportLayout.paneWidthPercent"
    >
      <PaneLayoutRenderer
        :class="ReportPaneKind.CenterPane"
        :data-paneKind="ReportPaneKind.CenterPane"
        :pane="centerReportLayout.content"
      />
    </SplitterPanel>
    <SplitterPanel
      v-if="rightPaneExistsWithWidth && rightReportLayout?.content"
      :size="rightReportLayout.paneWidthPercent"
    >
      <PaneLayoutRenderer
        :class="ReportPaneKind.RightPane"
        :data-paneKind="ReportPaneKind.RightPane"
        :pane="rightReportLayout.content"
      />
    </SplitterPanel>
  </Splitter>
</template>

<style>
.report-layout {
  display: flex;
}
</style>
