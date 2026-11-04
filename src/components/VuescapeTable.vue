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
import ColumnGroup from 'primevue/columngroup'
import DataTable from 'primevue/datatable'
import Row from 'primevue/row'
import type { DataTableSortEvent, DataTableStateEvent } from 'primevue/datatable'
import type { VuescapeTableProps } from '../models/componentProps/VuescapeTableProps'
import type { TableRow } from '../models/dynamic-ui/TableRow'

import PaneComponentRenderer from './PaneComponentRenderer.vue'
import { APPEND_ONLY_MAX_CELLS, getSpaceBelow } from '../utils/tableLayout'
import {
  flattenVisibleRows,
  getAllRows,
  getInitiallyExpandedRowIds,
  isTree,
  resolveFieldPath,
  sortTree,
} from '../utils/tableTree'
import type { VisibleTableRow } from '../utils/tableTree'
import { VuescapeTableDeepWatchKey, VuescapeTableScrollHeightKey } from './injectionKeys'

import { onBeforeUnmount, onMounted, reactive, ref, watch, computed, inject, unref } from 'vue'

// Define props
const props = defineProps<VuescapeTableProps & { initialScrollPosition: number | undefined }>()

// Inject deepWatch from parent (ReportLayoutRenderer provides it)
// Prefer prop value if explicitly set, otherwise use injected value, fallback to true
const injectedDeepWatch = inject(VuescapeTableDeepWatchKey, true)
const shouldDeepWatch = props.deepWatch ?? injectedDeepWatch

// A height (any CSS length) from an ancestor that cannot give the table the rest of the page, e.g. a dialog, where
// filling the screen would make the dialog scroll as well as the table. It may be a ref the ancestor updates, e.g. to
// fill the dialog as it resizes. Without it the table fills the page.
// Providing it at all (even as a ref that later holds '') turns off the self-measured dynamicScrollHeight for good:
// the check is whether the inject resolved, not what it holds.
const injectedScrollHeight = inject(VuescapeTableScrollHeightKey, undefined)

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
// The table's own "fill the rest of the page" height in px, measured by updateTableHeight on mount and window resize.
// Unused (left at this default) when an ancestor provides tableScrollHeight.
const dynamicScrollHeight = ref('576px')
// What the DataTable actually gets: the ancestor's height when one is provided, otherwise the measured one.
const scrollHeight = computed(() =>
  injectedScrollHeight === undefined ? dynamicScrollHeight.value : unref(injectedScrollHeight),
)

const localState = reactive({
  id: props.id,
  rows: [...props.rows],
  columns: [...props.columns],
})

// A table whose rows have child rows is shown as a tree. Child rows are ordinary rows placed under their parent, with
// a toggle and indent in the first column, so they share the table's columns.
const isTreeTable = computed(() => isTree(localState.rows))
const expandedRowIds = ref(getInitiallyExpandedRowIds(localState.rows))
// DataTable's own sort would separate child rows from their parents, so a tree table sorts itself (see tableRows)
// with the column and order DataTable reports
const treeSort = ref<{ field: string; order: number } | null>(null)

// Watch for changes in props and update local refs reactively
watch(
  [() => props.rows, () => props.columns, () => props.id],
  ([newRows, newColumns, id]) => {
    localState.rows = [...newRows]
    localState.columns = [...newColumns]
    localState.id = id
    expandedRowIds.value = getInitiallyExpandedRowIds(newRows)

    initializeColumnIdToSortFieldMap()
  },
  { deep: shouldDeepWatch }, // Deep watch can be disabled for large datasets via prop or inject
)

// Counts every row of a tree, not just the visible ones, so expanding rows can't switch the scroller's mode
const virtualScrollerOptions = computed(() => ({
  itemSize: 46,
  appendOnly:
    getAllRows(localState.rows).length * localState.columns.length <= APPEND_ONLY_MAX_CELLS,
}))

function toggleRow(rowId: string) {
  const ids = new Set(expandedRowIds.value)
  if (!ids.delete(rowId)) {
    ids.add(rowId)
  }
  expandedRowIds.value = ids
}

function setTreeSort(event: DataTableSortEvent | DataTableStateEvent) {
  treeSort.value =
    typeof event.sortField === 'string' && event.sortOrder
      ? { field: event.sortField, order: event.sortOrder }
      : null
}

function onScroll(e: Event) {
  emit('update:scrollPosition', (e.target as HTMLElement).scrollTop)
}

/**
 * Calculates the available height for the table based on viewport and wrapper position, so the page fills the
 * screen without scrolling. Uses getBoundingClientRect to determine how much vertical space is available.
 */
function updateTableHeight() {
  if (injectedScrollHeight !== undefined) {
    return
  }

  if (tableWrapperRef.value) {
    const rect = tableWrapperRef.value.getBoundingClientRect()
    // Available height: viewport height - current top position - whatever the layout adds below the table (measured,
    // not a fixed buffer, which drifted out of date and showed as a scrollbar).
    const viewportHeight = window.innerHeight
    const topPosition = rect.top
    const spaceBelow = getSpaceBelow(tableWrapperRef.value)
    const availableHeight = viewportHeight - topPosition - spaceBelow

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

// Realigns the frozen cells when the table's size changes the column widths. Runs after layout and before paint, so
// the misaligned cells are never shown.
const tableResizeObserver = new ResizeObserver(updateFrozenCellOffsets)

onMounted(() => {
  const tableEl: HTMLElement | undefined = dtRef.value?.$el?.querySelector('table')
  if (tableEl) {
    tableResizeObserver.observe(tableEl)
  }

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
  // Clean up resize listeners
  window.removeEventListener('resize', handleResize)
  tableResizeObserver.disconnect()
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

/**
 * Shows a cell's full text as its tooltip when the cell cuts it off with an ellipsis. Checked on hover rather than
 * set on every cell, so text that fits gets no tooltip.
 */
function setTitleIfTruncated(event: MouseEvent) {
  const textEl = event.currentTarget as HTMLElement
  textEl.title = textEl.scrollWidth > textEl.clientWidth ? (textEl.textContent?.trim() ?? '') : ''
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
  for (const row of getAllRows(localState.rows)) {
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
      `cells.${id}.${columnState.isValid && columnState.commonKey ? columnState.commonKey : 'displayValue'}`,
    )
  })
}

initializeColumnIdToSortFieldMap()

/**
 * Enhanced rows with null character preprocessing for empty string sorting.
 * Replaces empty displayValue and comparableValue.stringValue with null character (\u0000)
 * which sorts before any other character, ensuring empty strings appear first.
 * Optimized to only create new objects when necessary to reduce memory pressure.
 * Child rows are enhanced too, since a tree table sorts them.
 */
function enhanceRow(row: TableRow): TableRow {
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
          stringValue: '\u0000',
        }
      }

      cellsToEnhance[columnId] = enhancedCell
    }
  }

  const childRows = row.childRows?.length ? row.childRows.map(enhanceRow) : row.childRows

  // Only create new row/cells objects if modifications are needed
  if (needsEnhancement || childRows !== row.childRows) {
    return {
      ...row,
      cells: needsEnhancement ? { ...row.cells, ...cellsToEnhance } : row.cells,
      childRows,
    }
  }

  // Return original row if no enhancement needed
  return row
}

const enhancedRows = computed(() => localState.rows.map(enhanceRow))

/**
 * The rows the DataTable shows: a flat table's as they are (DataTable sorts them), a tree table's sorted within
 * each level and with the child rows of collapsed rows left out.
 */
const tableRows = computed((): Array<TableRow | VisibleTableRow> => {
  if (!isTreeTable.value) {
    return enhancedRows.value
  }

  const sort = treeSort.value
  const sortedRows = sort
    ? sortTree(enhancedRows.value, (row) => resolveFieldPath(row, sort.field), sort.order)
    : enhancedRows.value
  return flattenVisibleRows(sortedRows, expandedRowIds.value)
})

/**
 * Lines the frozen cells up with their columns again. PrimeVue offsets each frozen cell by the widths of the frozen
 * cells before it, but works out a cell's offset only when the cell renders. Column widths can change without that:
 * showing other rows (e.g. collapsing a tree row whose child rows were the widest in a column) or resizing the table
 * (e.g. the window narrowing until it scrolls horizontally), so frozen cells would keep their old offsets and overlap
 * or leave gaps. Matches PrimeVue's own calculation for columns frozen on the left, the only kind this table makes.
 */
function updateFrozenCellOffsets() {
  const tableEl: HTMLElement | undefined = dtRef.value?.$el?.querySelector('table')
  const headerRow = tableEl?.querySelector<HTMLElement>('thead > tr')
  if (!tableEl || !headerRow) {
    return
  }

  // A column's cells share its width, so the header row's widths give the offsets for every row
  const offsets: Array<string> = []
  let offset = 0
  headerRow
    .querySelectorAll<HTMLElement>(':scope > th.p-datatable-frozen-column')
    .forEach((cell) => {
      offsets.push(`${offset}px`)
      offset += cell.offsetWidth
    })

  tableEl
    .querySelectorAll<HTMLElement>(':scope > thead > tr, :scope > tbody > tr, :scope > tfoot > tr')
    .forEach((row) => {
      row
        .querySelectorAll<HTMLElement>(':scope > .p-datatable-frozen-column')
        .forEach((cell, index) => {
          cell.style.insetInlineStart = offsets[index] ?? cell.style.insetInlineStart
        })
    })
}

watch(tableRows, updateFrozenCellOffsets, { flush: 'post' })
</script>

<template>
  <!-- :sortOrder="sortingState.sortOrder"
    @sort="onSort"
    @update:sortField="(value) => (sortingState.sortField = value)"
    @update:sortOrder="(value) => (sortingState.sortOrder = value)"
            :sortField="(item) => getComparableValue(item, column.id)"

            paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"

    -->

  <div class="vuescape-table__container" ref="tableWrapperRef">
    <DataTable
      ref="dtRef"
      :value="tableRows"
      :lazy="isTreeTable"
      :scrollable="true"
      :scrollHeight="scrollHeight"
      :stripedRows="true"
      :showGridlines="true"
      tableStyle="min-width: 100%;"
      :virtualScrollerOptions="virtualScrollerOptions"
      stateStorage="session"
      :stateKey="localState.id"
      :resizable-columns="false"
      size="small"
      @sort="setTreeSort"
      @state-restore="setTreeSort"
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

      <template v-for="(column, columnIndex) in localState.columns" :key="column.id">
        <Column
          :field="column.id"
          :header="column.headerText"
          :sortable="column.isSortable"
          :frozen="column.isFrozen"
          :style="column.style"
          :sortField="columnIdToSortFieldMap.get(column.id)"
        >
          <template #body="slotProps">
            <div
              :style="
                slotProps.data.cells[column.id].component
                  ? undefined
                  : getCellStyle(slotProps.data, column.id)
              "
              class="cell-content"
            >
              <!-- A tree table's first column: the row's toggle, or room for one, indented by its depth -->
              <span
                v-if="isTreeTable && columnIndex === 0"
                class="vuescape-table__row-toggle"
                :style="{ '--vuescape-table-tree-depth': slotProps.data.depth }"
              >
                <button
                  v-if="slotProps.data.hasChildRows"
                  type="button"
                  :aria-expanded="slotProps.data.isExpanded"
                  :aria-label="slotProps.data.isExpanded ? 'Collapse row' : 'Expand row'"
                  @click="toggleRow(slotProps.data.id)"
                >
                  <i
                    :class="[
                      'fa-light',
                      slotProps.data.isExpanded ? 'fa-chevron-down' : 'fa-chevron-right',
                    ]"
                    aria-hidden="true"
                  />
                </button>
              </span>
              <PaneComponentRenderer
                v-if="slotProps.data.cells[column.id].component"
                :component="slotProps.data.cells[column.id].component"
              />
              <!-- Kept to one line, so long text can't make a row taller than the virtual scroller's fixed row
                   height. Frozen columns (e.g. names) wrap instead of cutting off what identifies the row. -->
              <span
                v-else-if="!column.isFrozen"
                class="vuescape-table__cell-text"
                @mouseenter="setTitleIfTruncated"
              >
                {{ getDisplayValue(slotProps.data, column.id) }}
              </span>
              <template v-else>{{ getDisplayValue(slotProps.data, column.id) }}</template>
            </div>
          </template>
        </Column>
      </template>

      <ColumnGroup v-if="props.footerRows?.length" type="footer">
        <Row v-for="footerRow in props.footerRows" :key="footerRow.id">
          <Column
            v-for="column in localState.columns"
            :key="column.id"
            :frozen="column.isFrozen"
            :footer="footerRow.cells[column.id]?.displayValue ?? ''"
            :footerStyle="footerRow.cells[column.id]?.cssStyles"
          />
        </Row>
      </ColumnGroup>
    </DataTable>
  </div>
</template>

<style>
.p-datatable-scrollable .p-datatable-tbody > tr > td.p-datatable-frozen-column {
  background: inherit;
}
/*
 * PrimeVue leaves footer cells without a background, so the cells scrolling under a frozen footer cell would show
 * through it. A cell's own style (e.g. a colored total) still wins.
 */
.p-datatable-scrollable .p-datatable-tfoot > tr > td.p-datatable-frozen-column {
  z-index: 1;
  background: var(--p-datatable-footer-cell-background);
}
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
/*
 * A non-frozen column grows with its text up to the max width, then cuts the text off with an ellipsis. The
 * max-content width keeps the column from being squeezed narrower than its text (or the max width) when the table is
 * wider than its container: overflow: hidden alone would let it shrink to nothing instead of scrolling horizontally.
 */
.vuescape-table__cell-text {
  width: max-content;
  max-width: var(--vuescape-table-cell-max-width, 20rem);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/*
 * Each level is indented by the toggle's width plus its gap, so a child's toggle sits under its parent's text. The
 * chevron is at the toggle's left edge, so the down chevron lines up with the parent's first letter.
 */
.vuescape-table__row-toggle {
  --vuescape-table-tree-toggle-width: 1rem;
  --vuescape-table-tree-toggle-gap: 0.25rem;
  display: inline-flex;
  flex-shrink: 0;
  width: var(--vuescape-table-tree-toggle-width);
  margin-right: var(--vuescape-table-tree-toggle-gap);
  margin-left: calc(
    var(--vuescape-table-tree-depth, 0) *
      (var(--vuescape-table-tree-toggle-width) + var(--vuescape-table-tree-toggle-gap))
  );
}
.vuescape-table__row-toggle > button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  width: var(--vuescape-table-tree-toggle-width);
  height: var(--vuescape-table-tree-toggle-width);
  padding: 0;
  border: none;
  background: transparent;
  color: var(--p-text-muted-color);
  cursor: pointer;
}
/*
 * Both chevrons take the down chevron's width (1em), with the narrower right chevron (0.625em) centered in it, so a
 * chevron turns in place and keeps the same gap to the text
 */
.vuescape-table__row-toggle > button > i {
  width: 1em;
  text-align: center;
}
/* Widens the click target to 24px without taking up layout space */
.vuescape-table__row-toggle > button::after {
  content: '';
  position: absolute;
  inset: -0.25rem;
}
/* Only the chevron darkens on hover: a filled background would crowd the table's colored cells */
.vuescape-table__row-toggle > button:hover {
  color: var(--p-text-color);
}
/* The focus ring goes around the chevron rather than the button, whose chevron is at its left edge */
.vuescape-table__row-toggle > button:focus-visible {
  outline: none;
}
.vuescape-table__row-toggle > button:focus-visible > i {
  border-radius: var(--p-border-radius-sm);
  outline: var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);
  outline-offset: var(--p-focus-ring-offset);
}
</style>
