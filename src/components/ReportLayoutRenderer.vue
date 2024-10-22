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

import type { ReportLayout } from '../models/dynamic-ui/ReportLayout'

const props = defineProps<{
  report: ReportLayout
}>()

const report = ref(
  props.report || {
    id: 'report1',
    title: 'Sample Report',
    leftPane: { id: 'left1', sections: [], paneWidthPercent: 33 },
    centerPane: { id: 'center1', sections: [], paneWidthPercent: 34 },
    rightPane: { id: 'right1', sections: [], paneWidthPercent: 33 }
  }
)
</script>

<template>
  <Splitter style="height: 100vh">
    <SplitterPanel :size="report.leftPane.paneWidthPercent">
      <PaneLayoutView :pane="report.leftPane" />
    </SplitterPanel>
    <SplitterPanel :size="report.centerPane.paneWidthPercent">
      <PaneLayoutView :pane="report.centerPane" />
    </SplitterPanel>
    <SplitterPanel :size="report.rightPane.paneWidthPercent">
      <PaneLayoutView :pane="report.rightPane" />
    </SplitterPanel>
  </Splitter>
</template>

<style>
.report-layout {
  display: flex;
}
</style>
