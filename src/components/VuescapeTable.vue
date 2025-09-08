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

import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

// Define props
const props = defineProps<VuescapeTableProps & { initialScrollPosition: number | undefined }>()

/**
 * This component currently uses a typed event model (e.g. `@change`, `@update`).
 * If this component is later used inside a dynamic wizard or needs to emit
 * `can-continue` or unified `update` events, it may be wrapped in a
 * wizard-specific variant (e.g., `WizardFileUpload.vue`) to keep the core
 * component agnostic of wizard behavior.
 */
const emit = defineEmits<{ (e: 'update:scrollPosition', val: number): void }>()

const dtRef = ref<any>(null)

const localState = reactive({
  id: props.id,
  rows: [...props.rows],
  columns: [...props.columns]
})

// Watch for changes in props and update local refs reactively
watch(
  [() => props.rows, () => props.columns, () => props.id],
  ([newRows, newColumns, id]) => {
    localState.rows = [...newRows]
    localState.columns = [...newColumns]
    localState.id = id

    initializeColumnIdToSortFieldMap()
  },
  { deep: true }
)

function onScroll(e: Event) {
  emit('update:scrollPosition', (e.target as HTMLElement).scrollTop)
}

onMounted(() => {
  const scrollerEl = dtRef.value?.getVirtualScrollerRef?.()?.$el
  if (scrollerEl) {
    scrollerEl.addEventListener('scroll', onScroll)
    // Restore scroll
    if (props.initialScrollPosition ?? 0 > 0) {
      setTimeout(() => {
        scrollerEl.scrollTo({ top: props.initialScrollPosition })
      }, 0)
    }
  }
})

onBeforeUnmount(() => {
  const scrollerEl = dtRef.value?.getVirtualScrollerRef?.()?.$el
  scrollerEl?.removeEventListener('scroll', onScroll)
})
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

// function getDisplayHtml(row: TableRow, columnId: string): string {
//   const text = getDisplayValue(row, columnId)
//   return `<a href="https://www.cometrics.com">${text}</a>`
// }

/**
 * Map of column id to sort field. This map is used to determine the sort field for each column.
 * Saved in a variable to avoid re-creating the map on each render.
 */
const columnIdToSortFieldMap = new Map<string, string>()

/**
 * Initializes the mapping between column IDs and their corresponding sort fields.
 * TODO: perhaps this could be calculated on the backend and passed as a value.
 */
function initializeColumnIdToSortFieldMap() {
  columnIdToSortFieldMap.clear()

  const columnIds = localState.columns.map((column) => column.id)

  // Initialize a map to track the sort fields for each column
  const columnSortCandidates: Record<string, { commonKey: string | null; isValid: boolean }> = {}
  columnIds.forEach((id) => {
    columnSortCandidates[id] = { commonKey: null, isValid: true }
  })

  // Iterate through rows once and evaluate all columns
  for (const row of localState.rows) {
    for (const columnId of columnIds) {
      const cell = row.cells[columnId]
      const columnState = columnSortCandidates[columnId]

      if (!columnState.isValid) {
        // Skip further checks for this column if already invalid
        continue
      }

      if (!cell || !cell.comparableValue) {
        // Invalidate the column if the cell or comparableValue is missing
        columnState.isValid = false
        continue
      }

      const keys = Object.keys(cell.comparableValue)
      if (keys.length !== 1) {
        // Invalidate the column if there are multiple or no keys
        columnState.isValid = false
        continue
      }

      const key = keys[0]
      const commonKey = `comparableValue.${key}`
      if (!columnState.commonKey) {
        // Set the first key as the common key for this column
        columnState.commonKey = commonKey
      } else if (columnState.commonKey !== commonKey) {
        // Invalidate the column if keys are inconsistent
        columnState.isValid = false
      }
    }
  }

  // Populate the columnIdToSortFieldMap with results
  columnIds.forEach((id) => {
    const columnState = columnSortCandidates[id]
    columnIdToSortFieldMap.set(
      id,
      `cells.${id}.${columnState.isValid && columnState.commonKey ? columnState.commonKey : 'displayValue'}`
    )
  })
}

initializeColumnIdToSortFieldMap()
// const sortingState = reactive({
//   sortField: '',
//   sortOrder: 1
// })
// function stateRestore(event: DataTableStateEvent) {
//   console.log('stateRestore', event)
// }
// function stateSave(event: DataTableStateEvent) {
//   console.log('stateSave', event)
// }
</script>

<template>
  <!-- :sortOrder="sortingState.sortOrder"
    @sort="onSort"
    @update:sortField="(value) => (sortingState.sortField = value)"
    @update:sortOrder="(value) => (sortingState.sortOrder = value)" 
            :sortField="(item) => getComparableValue(item, column.id)"

            paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"

    -->

  <DataTable
    ref="dtRef"
    :value="localState.rows"
    :scrollable="true"
    scroll-height="500px"
    :stripedRows="true"
    :showGridlines="true"
    tableStyle="min-width: 100%;"
    :virtualScrollerOptions="{ itemSize: 46 }"
    stateStorage="session"
    :stateKey="localState.id"
    :resizable-columns="false"
  >
    <!-- v-model:sortField="sortingState.sortField"
      v-model:sortOrder="sortingState.sortOrder"
    @state-restore="stateRestore"
    @state-save="stateSave" -->
    <template #empty>
      <div class="text-center">
        <p>No Results Found</p>
      </div>
    </template>

    <template v-for="column in localState.columns" :key="column.id">
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
