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

import VuescapeSelect from './VuescapeSelect.vue'

import { ref } from 'vue'
import type { TableTabsProps } from '../models/componentProps/TableTabsProps'
import VuescapeTable from './VuescapeTable.vue'

const props = defineProps<TableTabsProps>()

// Assign the first tab as the active tab
const activeTabId = ref(props.tabs[0]?.id)

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
</script>

<template>
  <Tabs v-model:value="activeTabId" :lazy="true">
    <div class="flex align-items-center justify-content-between">
      <TabList>
        <Tab v-for="tab in props.tabs" :key="tab.id" :value="tab.id">{{ tab.label }}</Tab>
      </TabList>
      <div class="ml-4" v-if="props.selectComponent">
        <VuescapeSelect v-bind="props.selectComponent.payload"></VuescapeSelect>
      </div>
    </div>
    <TabPanels>
      <TabPanel v-for="tab in props.tabs" :key="tab.id" :value="tab.id">
        <VuescapeTable
          v-if="tab.table"
          v-bind="tab.table.payload"
          :initialScrollPosition="getInitialScrollPosition(tab.id)"
          @update:scrollPosition="updateInitialScrollPosition(tab.id, $event)"
        ></VuescapeTable>
        <div v-else>No Results Found</div>
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<style scoped></style>
