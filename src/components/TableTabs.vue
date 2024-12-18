<script lang="ts">
/**
 * TableTabsComponent @component
 *
 * This is a Vue Single File Component (SFC) that renders a collection of TabComponents.
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

import type { TableTabsProps } from '../models/componentProps/TableTabsProps'

const props = defineProps<TableTabsProps>()
</script>

<template>
  <Tabs value="0">
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
        {{ tab.table ? JSON.stringify(tab.table) : 'No Results Found' }}
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<style scoped></style>
