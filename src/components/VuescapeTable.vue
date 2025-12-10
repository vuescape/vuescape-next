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
import type { VuescapeTableProps } from '../models/componentProps/VuescapeTableProps'
import type { TableRow } from '../models/dynamic-ui/TableRow'

import PaneComponentRenderer from './PaneComponentRenderer.vue'

import { onBeforeUnmount, onMounted, reactive, ref, watch, computed, inject } from 'vue'

// Define props
const props = defineProps<VuescapeTableProps & { initialScrollPosition: number | undefined }>()

// Inject deepWatch from parent (ReportLayoutRenderer provides it)
// Prefer prop value if explicitly set, otherwise use injected value, fallback to true
const injectedDeepWatch = inject<boolean>('deepWatch', true)
const shouldDeepWatch = props.deepWatch ?? injectedDeepWatch

/**
 * This component currently uses a typed event model (e.g. `@change`, `@update`).
 * If this component is later used inside a dynamic wizard or needs to emit
 * `can-continue` or unified `update` events, it may be wrapped in a
 * wizard-specific variant (e.g., `WizardFileUpload.vue`) to keep the core
 * component agnostic of wizard behavior.
 */
const emit = defineEmits<{ (e: 'update:scrollPosition', val: number): void }>()

const dtRef = ref<any>(null)
const tableWrapperRef = ref<HTMLElement | null>(null)
const dynamicScrollHeight = ref('576px')

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
  { deep: shouldDeepWatch } // Deep watch can be disabled for large datasets via prop or inject
)

function onScroll(e: Event) {
  emit('update:scrollPosition', (e.target as HTMLElement).scrollTop)
}

/**
 * Calculates the available height for the table based on viewport and wrapper position.
 * Uses getBoundingClientRect to determine how much vertical space is available.
 */
function updateTableHeight() {
  if (tableWrapperRef.value) {
    const rect = tableWrapperRef.value.getBoundingClientRect()
    // Calculate available height: viewport height - current top position - buffer for footer
    const viewportHeight = window.innerHeight
    const topPosition = rect.top
    const footerBuffer = 84 // Space for footer and padding
    const availableHeight = viewportHeight - topPosition - footerBuffer

    // Use available height with minimum of 276px
    const tableHeight = Math.max(276, availableHeight)
    dynamicScrollHeight.value = `${tableHeight}px`
  }
}

/**
 * Lifecycle hook that runs after the component is mounted to the DOM.
 * Sets up scroll event handling and restores the initial scroll position if provided.
 *
 * This method:
 * 1. Gets a reference to the virtual scroller element from the DataTable component
 * 2. Adds a scroll event listener to track scroll position changes
 * 3. Restores the initial scroll position if one was provided via props
 * 4. Calculates table height once on mount and on window resize only
 *
 * The scroll restoration uses setTimeout with 0 delay to ensure it runs after
 * the virtual scroller has fully initialized and rendered its content.
 */
// Resize handler defined at module scope so it can be cleaned up
const handleResize = () => {
  updateTableHeight()
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

  // Calculate table height on mount
  // Use setTimeout to ensure DOM is fully rendered
  setTimeout(() => {
    updateTableHeight()
  }, 0)

  // Only recalculate on window resize (not on every parent change)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  // Clean up resize listener
  window.removeEventListener('resize', handleResize)
  // Clean up scroll listener
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
  let result = cell?.displayValue ?? ''

  // Convert null character back to empty string for display
  if (result === '\u0000') {
    result = ''
  }

  return result
}

/**
 * Retrieves the CSS style for a cell.
 *
 * @param row - The row object containing data.
 * @param  columnId - The identifier for the column.
 * @returns The style for the specified row and column.
 */
function getCellStyle(row: TableRow, columnId: string): Record<string, string> | undefined {
  const cell = row.cells[columnId]
  // Don't use the raw value even if there is no display value.
  const result = cell?.cssStyles ?? undefined
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

/**
 * Enhanced rows with null character preprocessing for empty string sorting.
 * Replaces empty displayValue and comparableValue.stringValue with null character (\u0000)
 * which sorts before any other character, ensuring empty strings appear first.
 * Optimized to only create new objects when necessary to reduce memory pressure.
 */
const enhancedRows = computed(() => {
  return localState.rows.map((row) => {
    // Check if any cells need modification first
    let needsEnhancement = false
    const cellsToEnhance: Record<string, any> = {}

    for (const columnId in row.cells) {
      const cell = row.cells[columnId]
      if (cell && (cell.displayValue === '' || cell.comparableValue?.stringValue === '')) {
        needsEnhancement = true
        const enhancedCell = { ...cell }

        if (cell.displayValue === '') {
          enhancedCell.displayValue = '\u0000' // Null character sorts first
        }

        if (cell.comparableValue?.stringValue === '') {
          enhancedCell.comparableValue = {
            ...cell.comparableValue,
            stringValue: '\u0000'
          }
        }

        cellsToEnhance[columnId] = enhancedCell
      }
    }

    // Only create new row/cells objects if modifications are needed
    if (needsEnhancement) {
      return {
        ...row,
        cells: {
          ...row.cells,
          ...cellsToEnhance
        }
      }
    }

    // Return original row if no enhancement needed
    return row
  })
})
</script>

<template>
  <!-- :sortOrder="sortingState.sortOrder"
    @sort="onSort"
    @update:sortField="(value) => (sortingState.sortField = value)"
    @update:sortOrder="(value) => (sortingState.sortOrder = value)"
            :sortField="(item) => getComparableValue(item, column.id)"

            paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"

    -->

  <div ref="tableWrapperRef">
    <DataTable
      ref="dtRef"
      :value="enhancedRows"
      :scrollable="true"
      :scrollHeight="dynamicScrollHeight"
      :stripedRows="true"
      :showGridlines="true"
      tableStyle="min-width: 100%;"
      :virtualScrollerOptions="{ itemSize: 46 }"
      stateStorage="session"
      :stateKey="localState.id"
      :resizable-columns="false"
      size="small"
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
            <div v-if="slotProps.data.cells[column.id].component" class="cell-content">
              <PaneComponentRenderer :component="slotProps.data.cells[column.id].component" />
            </div>
            <div v-else :style="getCellStyle(slotProps.data, column.id)" class="cell-content">{{ getDisplayValue(slotProps.data, column.id) }}</div>
          </template>
        </Column>
      </template>
    </DataTable>
  </div>
</template>

<style>
  .p-datatable.p-datatable-sm .p-datatable-tbody > tr > td {
    padding: 0 !important;
  }
  .p-datatable-tbody > tr > td {
    padding: 0 !important;
  }

  .cell-content {
    padding: var(--p-datatable-body-cell-sm-padding);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
</style>
