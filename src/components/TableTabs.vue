<script lang="ts">
/**
 * TableTabs @component
 *
 * This is a Vue Single File Component (SFC) that renders a collection of TabComponents.
 *
 * Tabs are lazy loaded so that @see VuescapeTable is rendered when using VirutalScroller.
 * If lazy loading is not used, the table will not render any rows. The consequence of lazy
 * loading is that the table is created and destroyed each time the tab is selected so
 * we need to reset the table state (in this case scroll position) each time the tab is selected.
 *
 * A tab may be deferred: it has no table, only an onSelectAction that loads its content (e.g. navigates
 * to the route that renders the report with that tab's table). The tab named by activeTabId is shown
 * initially, or else the first tab with a table.
 *
 * @prop {TableTabsProps} - the TableTabs props
 *
 */
export default {}
</script>

<script lang="ts" setup>
import Tab from 'primevue/tab'
import TabList from 'primevue/tablist'
import TabPanel from 'primevue/tabpanel'
import TabPanels from 'primevue/tabpanels'
import Tabs from 'primevue/tabs'
import { defineAsyncComponent } from 'vue'

import type { SelectChangeEvent } from 'primevue/select'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRetainedField } from '../composables/useRetainedField'
import type { TableTabsProps } from '../models/componentProps/TableTabsProps'
import type { Action } from '../models/dynamic-ui/actions/Action'
import { handleNavigationActionAsync } from '../models/dynamic-ui/actions/ActionHandlers'
import { ReportPaneKind } from '../models/feature/ReportPaneKind'
import { useActionStore } from '../stores/useActionStore'

const VuescapeSelect = defineAsyncComponent(() => import('./VuescapeSelect.vue'))
const VuescapeTable = defineAsyncComponent(() => import('./VuescapeTable.vue'))

const props = defineProps<TableTabsProps>()

const actionStore = useActionStore()
const router = useRouter()

const initialTabId =
  (
    props.tabs.find((tab) => tab.id === props.activeTabId) ??
    props.tabs.find((tab) => tab.table) ??
    props.tabs[0]
  )?.id ?? 'default'
const queryKey = 'tab'

// Auto: if route.meta.retainQuery is true, this will sync to URL+store.
// If false, it just behaves like a normal local state ref.
const { value: activeTab } = useRetainedField<string>(queryKey, initialTabId)

// if (props.tabs.some((_) => _.id === initalTabId) === false) {
//   activeTab.value = initalTabId
// }
const selectedEntity = ref<string | null>(null)

const tableToInitialScrollPositionMap = new Map<string, number>()
props.tabs.forEach((tab) => {
  if (tab.table) {
    tableToInitialScrollPositionMap.set(tab.id, tab.table.payload?.initialScrollPosition ?? 0)
  }
})

function updateInitialScrollPosition(tabId: string, scrollPosition: number) {
  tableToInitialScrollPositionMap.set(tabId, scrollPosition)
}

function getInitialScrollPosition(tabId: string) {
  const result = tableToInitialScrollPositionMap.get(tabId) ?? 0
  return result
}

function setEntity(event: SelectChangeEvent) {
  selectedEntity.value = event?.value?.id ?? null
}

function tableKey(tabId: string) {
  const result = `${props.id}::${tabId}::${selectedEntity.value ?? ''}`
  return result
}

async function performActionAsync(action: Action) {
  if (action.typeName === 'action.navigate') {
    // This component does not load reports into panes; navigation targets render via the router.
    await handleNavigationActionAsync(action, ReportPaneKind.None, router, () => Promise.resolve())
  } else {
    actionStore.dispatch(action)
  }
}

watch(activeTab, async (tabId) => {
  const action = props.tabs.find((tab) => tab.id === tabId)?.onSelectAction
  if (action) {
    await performActionAsync(action)
  }
})
</script>

<template>
  <Tabs v-model:value="activeTab" :lazy="true">
    <div class="flex items-center justify-between" v-if="props.tabs.length > 1 || props.selectComponent">
      <TabList>
        <Tab v-for="tab in props.tabs" :key="tab.id" :value="tab.id">{{ tab.label }}</Tab>
      </TabList>
      <div class="mr-5" v-if="props.selectComponent">
        <VuescapeSelect
          :key="`${props.id}-${props.selectComponent.payload.id}`"
          @change="setEntity"
          v-bind="props.selectComponent.payload"
        ></VuescapeSelect>
      </div>
    </div>
    <TabPanels>
      <TabPanel v-for="tab in props.tabs" :key="tab.id" :value="tab.id">
        <VuescapeTable
          v-if="tab.table"
          v-bind="tab.table.payload"
          :id="tableKey(tab.id)"
          :initialScrollPosition="getInitialScrollPosition(tab.id)"
          @update:scrollPosition="updateInitialScrollPosition(tab.id, $event)"
        ></VuescapeTable>
        <div v-else-if="!tab.onSelectAction">No Results Found</div>
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<style scoped></style>
