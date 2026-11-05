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
import { ref, watch, computed, onMounted, onBeforeUnmount, provide } from 'vue'

import PaneComponentRenderer from './PaneComponentRenderer.vue'
import PaneLayoutRenderer from './PaneLayoutRenderer.vue'
import { VuescapeTableDeepWatchKey } from './injectionKeys'

import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'

import type { ReportLayoutRendererProps } from '../models/componentProps/ReportLayoutRendererProps'
import { ReportPaneKind } from '../models/feature/'
import type { ReportLayout } from '../models'
import { getSpaceBelow, SPLIT_PANE_CLASS, SPLIT_PANES_CLASS } from '../utils/tableLayout'

/** The panes' least height, so they stay usable in a short window */
const MIN_SPLIT_PANES_HEIGHT = 320

const props = defineProps<ReportLayoutRendererProps>()

// Provide deepWatch setting to all child components (including dynamically loaded ones like VuescapeTable)
provide(VuescapeTableDeepWatchKey, props.deepWatch ?? true)

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
  { immediate: true, deep: props.deepWatch ?? true } // Syncs immediately on mount; deep watch can be disabled for large datasets
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

const hasCenterPaneBesideOthers = computed(
  () =>
    !isOnlyCenterPane.value &&
    centerPaneExistsWithWidth.value &&
    !!centerReportLayout.value?.content
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

// Side-by-side panes fill the rest of the page, so the dividers between them run down to the footer and each pane
// scrolls on its own. Measured like VuescapeTable's height: on mount, when the panes first show and on window resize.
const splitterRef = ref<{ $el: HTMLElement } | null>(null)
const splitPanesHeight = ref<string>()

function updateSplitPanesHeight() {
  const splitPanes = splitterRef.value?.$el
  if (!splitPanes) {
    return
  }

  const availableHeight =
    window.innerHeight - splitPanes.getBoundingClientRect().top - getSpaceBelow(splitPanes)
  splitPanesHeight.value = `${Math.max(MIN_SPLIT_PANES_HEIGHT, availableHeight)}px`
}

watch(splitterRef, updateSplitPanesHeight, { flush: 'post' })

onMounted(() => {
  const title = pageTitle.value
  window.addEventListener('resize', updateSplitPanesHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSplitPanesHeight)
})
</script>

<template>
  <!-- <h3>{{ reportLayout.title }}</h3> -->
  <div
    v-if="(reportDetail || actionButton) && !hasCenterPaneBesideOthers"
    class="flex items-center justify-end gap-2"
  >
    <span class="mr-2">{{ reportDetail }}</span>
    <PaneComponentRenderer :component="actionButton" v-if="actionButton"></PaneComponentRenderer>
  </div>
  <PaneLayoutRenderer
    :data-paneKind="ReportPaneKind.CenterPane"
    :class="ReportPaneKind.CenterPane"
    v-if="isOnlyCenterPane && centerReportLayout?.content"
    :pane="centerReportLayout.content"
  />
  <!-- Side-by-side panes fill the rest of the page, each with its own report's title. Each table fills the rest of its
       pane (VuescapeTable). -->
  <Splitter
    v-else
    ref="splitterRef"
    :class="SPLIT_PANES_CLASS"
    :style="{ height: splitPanesHeight }"
  >
    <SplitterPanel
      v-if="leftPaneExistsWithWidth && leftReportLayout?.content"
      :size="leftReportLayout.paneWidthPercent"
    >
      <div :class="SPLIT_PANE_CLASS">
        <h2 v-if="leftReportLayout.title" class="report-layout__pane-title">
          {{ leftReportLayout.title }}
        </h2>
        <PaneLayoutRenderer
          :data-paneKind="ReportPaneKind.LeftPane"
          :class="ReportPaneKind.LeftPane"
          :pane="leftReportLayout.content"
        />
      </div>
    </SplitterPanel>
    <SplitterPanel
      v-if="centerPaneExistsWithWidth && centerReportLayout?.content"
      :size="centerReportLayout.paneWidthPercent"
    >
      <div :class="SPLIT_PANE_CLASS">
        <!-- The report's detail and actions sit beside its title, in its own pane -->
        <div
          v-if="centerReportLayout.title || reportDetail || actionButton"
          class="flex flex-wrap items-center gap-x-4 gap-y-1"
        >
          <h2 v-if="centerReportLayout.title" class="report-layout__pane-title mr-auto">
            {{ centerReportLayout.title }}
          </h2>
          <span v-if="reportDetail">{{ reportDetail }}</span>
          <PaneComponentRenderer :component="actionButton" v-if="actionButton" />
        </div>
        <PaneLayoutRenderer
          :class="ReportPaneKind.CenterPane"
          :data-paneKind="ReportPaneKind.CenterPane"
          :pane="centerReportLayout.content"
        />
      </div>
    </SplitterPanel>
    <SplitterPanel
      v-if="rightPaneExistsWithWidth && rightReportLayout?.content"
      :size="rightReportLayout.paneWidthPercent"
    >
      <div :class="SPLIT_PANE_CLASS">
        <h2 v-if="rightReportLayout.title" class="report-layout__pane-title">
          {{ rightReportLayout.title }}
        </h2>
        <PaneLayoutRenderer
          :class="ReportPaneKind.RightPane"
          :data-paneKind="ReportPaneKind.RightPane"
          :pane="rightReportLayout.content"
        />
      </div>
    </SplitterPanel>
  </Splitter>
</template>

<style>
.report-layout {
  display: flex;
}
/*
 * Reaches up to the app's header and down to its footer, over the gaps the app leaves beside them (App.vue). Without
 * an outer border, which would show as a line of the page's background between the dividers and the header and
 * footer. The extra class outranks PrimeVue's border, which it injects later.
 */
.report-layout__panes {
  margin-top: calc(-1 * var(--app-header-gap, 0px));
  margin-bottom: calc(-1 * var(--app-footer-gap, 0px));
}
.p-splitter.report-layout__panes {
  border-width: 0;
}
/* A pane taller than the panes (e.g. a long list in a short window) scrolls on its own */
.report-layout__panes > .p-splitterpanel {
  overflow: auto;
}
/* Keeps the panes' content off the dividers between them */
.p-splitterpanel:not(:first-child) > .report-layout__pane {
  padding-left: 0.5rem;
}
.p-splitterpanel:not(:last-child) > .report-layout__pane {
  padding-right: 0.5rem;
}
.report-layout__pane {
  padding-top: 0.5rem;
}
.report-layout__pane-title {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
}
</style>
