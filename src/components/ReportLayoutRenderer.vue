<script lang="ts">
/**
 * ReportLayoutRenderer @component
 *
 * This is a Vue Single File Component (SFC) that renders a report layout into
 * three panes: left, center, and right.
 *
 * @prop {ReportLayout} report - the ReportLayout to render
 *
 */
export default {}
</script>

<script setup lang="ts">
import { ref } from 'vue'

import PaneLayoutView from './PaneLayoutRenderer.vue'

import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'

import type { ReportLayoutRendererProps } from '../models/componentProps/ReportLayoutRendererProps'

const props = defineProps<ReportLayoutRendererProps>()

const reportLayout = ref(
  props.reportLayout || {
    id: 'report1',
    title: 'Sample Report',
    leftPane: { id: 'left1', sections: [], paneWidthPercent: 33 },
    centerPane: { id: 'center1', sections: [], paneWidthPercent: 34 },
    rightPane: { id: 'right1', sections: [], paneWidthPercent: 33 }
  }
)

// Accounts for header and footer
// TODO: get this data from somewhere else. Maybe put in state store?
const reportHeightOffset = 136 + (reportLayout.value.title! ? 30 : 0)
const isOnlyCenterPane =
  reportLayout.value.leftPane.paneWidthPercent === 0 &&
  reportLayout.value.rightPane.paneWidthPercent === 0
</script>

<template>
  <h3>{{ reportLayout.title }}</h3>
  <PaneLayoutView v-if="isOnlyCenterPane" :pane="reportLayout.centerPane" />
  <Splitter v-else :style="`height: calc(100vh - ${reportHeightOffset}px)`">
    <SplitterPanel
      v-if="reportLayout.leftPane.paneWidthPercent"
      :size="reportLayout.leftPane.paneWidthPercent"
    >
      <PaneLayoutView :pane="reportLayout.leftPane" />
    </SplitterPanel>
    <SplitterPanel
      v-if="reportLayout.centerPane.paneWidthPercent"
      :size="reportLayout.centerPane.paneWidthPercent"
    >
      <PaneLayoutView :pane="reportLayout.centerPane" />
    </SplitterPanel>
    <SplitterPanel
      v-if="reportLayout.rightPane.paneWidthPercent"
      :size="reportLayout.rightPane.paneWidthPercent"
    >
      <PaneLayoutView :pane="reportLayout.rightPane" />
    </SplitterPanel>
  </Splitter>
</template>

<style>
.report-layout {
  display: flex;
}
</style>
