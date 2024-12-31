<script lang="ts">
/**
 * VuescapeTable @component
 *
 * This is a Vue Single File Component (SFC) that renders a VuescapeTable.
 *
 * @prop {VuescapeTableProps} - the VuescapeTableProps
 *
 */
export default {}
</script>

<script setup lang="ts">
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
// import { ref, computed } from 'vue'
// import type { DataTableSortEvent } from 'primevue/datatable'
import type { VuescapeTableProps } from '../models/componentProps/VuescapeTableProps'
import type { TableRow } from '../models/dynamic-ui/TableRow'

import PaneComponentRenderer from './PaneComponentRenderer.vue'

// Define props
const props = defineProps<VuescapeTableProps>()

// Sorting state
// const sortingState = ref({
//   sortField: undefined as string | undefined,
//   sortOrder: undefined as number | undefined
// })

// // Computed sorted rows
// const sortedRows = computed(() => {
//   // Assign these values to local variables since they will be used in closure below.
//   const sortField = sortingState.value.sortField
//   const sortOrder = sortingState.value.sortOrder

//   if (!sortField || !sortOrder) {
//     return props.rows
//   }

//   return [...props.rows].sort((a, b) => {
//     const value1 = a[sortField]?.rawValue?.value ?? a[sortField]?.displayValue ?? ''
//     const value2 = b[sortField]?.rawValue?.value ?? b[sortField]?.displayValue ?? ''

//     if (value1 == null && value2 == null) return 0
//     if (value1 == null) return -1
//     if (value2 == null) return 1

//     if (typeof value1 === 'string' && typeof value2 === 'string') {
//       return sortOrder * value1.localeCompare(value2)
//     }
//     if (typeof value1 === 'number' && typeof value2 === 'number') {
//       return sortOrder * (value1 - value2)
//     }

//     return 0
//   })
// })

// // Handle sorting event
// function onSort(event: DataTableSortEvent) {
//   const augmentedEvent = event as DataTableSortEvent & { field?: string; order?: number }
//   // sortingState.value.sortField = augmentedEvent.field ?? undefined
//   // sortingState.value.sortOrder = augmentedEvent.order ?? undefined
// }

/**
 * Retrieves the display value for a given row and column.
 *
 * @param row - The row object containing data.
 * @param  columnId - The identifier for the column.
 * @returns The display value for the specified row and column.
 */
function getDisplayValue(row: TableRow, columnId: string): string {
  const cell = row.cells[columnId]
  // Don't use the raw value even if there is no display value.
  const result = cell?.displayValue ?? ''
  return result
}

function getSortField(column: { id: string }) {
  let sortProperty = 'comparableValue'
  const columnIndex = props.columns.findIndex((col) => col.id === column.id)
  if (columnIndex !== -1 && props.columns[columnIndex].isSortable && props.rows.length > 0) {
    const allCellsHaveComparableValue = props.rows.every(
      (row) => row.cells[column.id].comparableValue !== undefined
    )
    if (!allCellsHaveComparableValue) {
      sortProperty = 'displayValue'
    }
  }

  const result = `cells.${column.id}.${sortProperty}`
  return result
}
// Helper to get the comparable value for sorting
// function getComparableValue(row: TableRow, columnId: string) {
//   const result = row.cells[columnId]?.comparableValue?.toString() ?? ''
//   return result
// }

/**
 * Map of column id to sort field. This map is used to determine the sort field for each column.
 * Saved in a variable to avoid re-creating the map on each render.
 */
const columnIdToSortFieldMap = new Map<string, string>()
function initializeColumnIdToSortFieldMap() {
  columnIdToSortFieldMap.clear()
  props.columns.forEach((column) => {
    columnIdToSortFieldMap.set(column.id, getSortField(column))
  })
}

initializeColumnIdToSortFieldMap()
</script>

<template>
  <!-- :sortOrder="sortingState.sortOrder"
    @sort="onSort"
    @update:sortField="(value) => (sortingState.sortField = value)"
    @update:sortOrder="(value) => (sortingState.sortOrder = value)" 
            :sortField="(item) => getComparableValue(item, column.id)"

    -->

  <DataTable
    :value="rows"
    :dataKey="id"
    :scrollable="true"
    :stripedRows="true"
    :showGridlines="true"
    :resizableColumns="true"
    tableStyle="min-width: 100%;"
  >
    <template v-for="column in columns" :key="column.id">
      <Column
        :field="column.id"
        :header="column.headerText"
        :sortable="column.isSortable"
        :style="column.style"
        :sortField="columnIdToSortFieldMap.get(column.id)"
      >
        <template #body="slotProps">
          <span v-if="slotProps.data.cells[column.id].component">
            <PaneComponentRenderer :component="slotProps.data.cells[column.id].component" />
          </span>
          <span v-else>{{ getDisplayValue(slotProps.data, column.id) }}</span>
        </template>
      </Column>
    </template>
  </DataTable>
</template>

<style scoped>
/* Add custom styles for your table if needed */
</style>
