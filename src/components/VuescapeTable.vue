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
import { APPEND_ONLY_MAX_CELLS, getSpaceBelow, SPLIT_PANE_CLASS } from '../utils/tableLayout'
import type { ColumnPassThroughMethodOptions, ColumnPassThroughOptions } from 'primevue/column'
import { getBodyCellAttributes, getHeaderRows, getSpannedCells } from '../utils/tableHeaderRows'
import type { TableCell } from '../models/dynamic-ui/TableCell'
import type { TableColumn } from '../models/dynamic-ui/TableColumn'
import {
  flattenVisibleRows,
  getAllRows,
  getInitiallyExpandedRowIds,
  isTree,
  resolveFieldPath,
  sortTree,
} from '../utils/tableTree'
import type { VisibleTableRow } from '../utils/tableTree'
import {
  VuescapeTableDeepWatchKey,
  VuescapeTableScrollHeightKey,
  VuescapeTableStartsAtRightKey,
} from './injectionKeys'

import {
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  shallowRef,
  watch,
  computed,
  inject,
  unref,
} from 'vue'

// Define props
const props = defineProps<VuescapeTableProps & { initialScrollPosition: number | undefined }>()

const isStriped = computed(() => props.appearance?.isStriped ?? true)
const borders = computed(() => props.appearance?.borders ?? 'grid')

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

// Whether the table starts scrolled all the way to the right; an ancestor decides (see VuescapeTableStartsAtRightKey)
const startsAtRight = inject(VuescapeTableStartsAtRightKey, false)

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

// The header's rows, top to bottom: the table's own, or one of the columns' (deprecated) header text
const headerRows = computed(() => getHeaderRows(props.headerRows, localState.columns))
// A table without header rows (e.g. a list of links) shows no header
const isHeadless = computed(() => !headerRows.value.length)

// Each frozen column's offset from the table's left edge, by column ID (see updateFrozenCellOffsets)
const frozenColumnIdToOffsetMap = shallowRef(new Map<string, string>())

// PrimeVue renders a body cell in every column and has no colspan for one, so each column sets its cells' attributes
// row by row: a spanning cell's colspan, or hiding a cell its row's span covers. PrimeVue calls a column's bodyCell
// with the cell's own props, whose rowData is the row. A frozen column's cells also get its offset here, as PrimeVue
// works out its own whenever a cell updates and the pass-through's style wins. One per column, so the columns don't
// change on every render.
const columnIdToPassThroughMap = computed(
  () =>
    new Map(
      localState.columns.map((column): [string, ColumnPassThroughOptions] => [
        column.id,
        {
          bodyCell: ({ parent }: ColumnPassThroughMethodOptions) => {
            const attributes = getBodyCellAttributes(
              parent.props.rowData,
              localState.columns,
              column.id,
            )
            const offset = frozenColumnIdToOffsetMap.value.get(column.id)

            return offset === undefined
              ? attributes
              : { ...attributes, style: { insetInlineStart: offset } }
          },
        },
      ]),
    ),
)

// The bottom header row's cell over a single column holds that column's sort control
function getSortProps(column: TableColumn, rowIndex: number, colspan: number) {
  return rowIndex === headerRows.value.length - 1 && colspan === 1
    ? {
        field: column.id,
        sortable: column.isSortable,
        sortField: columnIdToSortFieldMap.get(column.id),
      }
    : {}
}

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

// In a pane beside other panes (ReportLayoutRenderer), what's above the table can still change size after it has
// measured its height, e.g. a report's Download button loading in, so it measures again when its pane resizes. Its
// own new height resizes the pane once more, and that measure changes nothing.
const paneResizeObserver = new ResizeObserver(updateTableHeight)

onMounted(() => {
  const tableEl: HTMLElement | undefined = dtRef.value?.$el?.querySelector('table')
  if (tableEl) {
    tableResizeObserver.observe(tableEl)
  }

  const pane = tableWrapperRef.value?.closest(`.${SPLIT_PANE_CLASS}`)
  if (pane) {
    paneResizeObserver.observe(pane)
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
    // After the columns have their widths. Past the end is clamped to the end.
    if (startsAtRight) {
      setTimeout(() => {
        scrollerEl.scrollLeft = scrollerEl.scrollWidth
      }, 0)
    }
  }

  // Measure now, so the first paint already fits the page: painted at the default height first, a table low on the page
  // (e.g. one a tab has just shown) runs past the bottom, and the page's scroll bar flashes and shifts it sideways. Not
  // when the table isn't laid out yet (e.g. in a hidden tab), where the measure would be meaningless.
  if (tableWrapperRef.value?.getClientRects().length) {
    updateTableHeight()
  }
  // And again once the rest of the page has rendered
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
  paneResizeObserver.disconnect()
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
 * Replaces a blank displayValue (empty, or none at all, including a column the row has no cell for) and an empty
 * comparableValue.stringValue with null character (\u0000), which sorts before any other character, ensuring blanks
 * appear first in ascending order and last in descending. DataTable would otherwise put a missing value last either
 * way, so a column of one value and blanks wouldn't change order when sorted the other way.
 * Optimized to only create new objects when necessary to reduce memory pressure.
 * Child rows are enhanced too, since a tree table sorts them.
 */
function enhanceRow(row: TableRow): TableRow {
  // Check if any cells need modification first
  let needsEnhancement = false
  const cellsToEnhance: Record<string, any> = {}

  for (const { id: columnId } of localState.columns) {
    const cell = row.cells[columnId]
    const isBlank = cell?.displayValue == null || cell.displayValue === ''
    if (isBlank || cell?.comparableValue?.stringValue === '') {
      needsEnhancement = true
      const enhancedCell: TableCell = { ...cell }

      if (isBlank) {
        enhancedCell.displayValue = '\u0000' // Null character sorts first
      }

      if (cell?.comparableValue?.stringValue === '') {
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
 * or leave gaps. Matches PrimeVue's own calculation for columns frozen on the left, the only kind this table makes,
 * except that it keeps the widths' fractions: PrimeVue's whole-pixel widths put a frozen cell up to a pixel left of
 * where it sits unscrolled, so it jumps when the table starts scrolling.
 */
function updateFrozenCellOffsets() {
  const tableEl: HTMLElement | undefined = dtRef.value?.$el?.querySelector('table')
  const headerRow = tableEl?.querySelector<HTMLElement>('thead > tr:last-child')
  if (!tableEl || !headerRow) {
    return
  }

  // A column's cells share its width, so the bottom header row's widths (a cell per column) give the offsets for
  // every row
  const offsets: Array<string> = []
  let offset = 0
  headerRow
    .querySelectorAll<HTMLElement>(':scope > th.p-datatable-frozen-column')
    .forEach((cell) => {
      offsets.push(`${offset}px`)
      offset += cell.getBoundingClientRect().width
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

  // The body cells' offsets, which PrimeVue would otherwise put back to its own when a cell updates. Only when they
  // change, as each change renders the body cells again.
  const frozenColumnIdToOffsetMapNext = new Map(
    localState.columns
      .filter((column) => column.isFrozen)
      .flatMap((column, index): Array<[string, string]> =>
        offsets[index] === undefined ? [] : [[column.id, offsets[index]]],
      ),
  )
  const current = frozenColumnIdToOffsetMap.value
  const isUnchanged =
    current.size === frozenColumnIdToOffsetMapNext.size &&
    [...frozenColumnIdToOffsetMapNext].every(
      ([columnId, offset]) => current.get(columnId) === offset,
    )
  if (!isUnchanged) {
    frozenColumnIdToOffsetMap.value = frozenColumnIdToOffsetMapNext
  }
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

  <div class="vuescape-table">
    <!-- The footnotes are below the table's container, so the table measures them as space below it (updateTableHeight) -->
    <div class="vuescape-table__container" ref="tableWrapperRef">
      <DataTable
        ref="dtRef"
        :class="{
          'vuescape-table--headless': isHeadless,
          'vuescape-table--borderless': borders === 'none',
        }"
        :value="tableRows"
        :lazy="isTreeTable"
        :scrollable="true"
        :scrollHeight="scrollHeight"
        :stripedRows="isStriped"
        :showGridlines="borders === 'grid'"
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
            :sortable="column.isSortable"
            :frozen="column.isFrozen"
            :style="column.style"
            :sortField="columnIdToSortFieldMap.get(column.id)"
            :pt="columnIdToPassThroughMap.get(column.id)"
          >
            <template #body="slotProps">
              <div
                :style="
                  slotProps.data.cells[column.id]?.component
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
                  v-if="slotProps.data.cells[column.id]?.component"
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
                <span v-else class="vuescape-table__frozen-cell-text">
                  {{ getDisplayValue(slotProps.data, column.id) }}
                </span>
              </div>
            </template>
          </Column>
        </template>

        <!-- The header's rows, in place of the columns' own headers.
           The column groups' keys are their own: DataTable takes a keyed child of its slot to hold every column with
           an ancestor of the same key, so v-if's automatic keys (0, 1, ...) could match one far up the page and show
           every column twice. -->
        <ColumnGroup v-if="headerRows.length" key="vuescape-table-header-rows" type="header">
          <Row v-for="(headerRow, rowIndex) in headerRows" :key="headerRow.id">
            <Column
              v-for="{ column, cell, colspan } in getSpannedCells(headerRow, localState.columns)"
              :key="column.id"
              :frozen="column.isFrozen"
              :colspan="colspan"
              :header="cell.displayValue ?? ''"
              :headerStyle="cell.cssStyles"
              v-bind="getSortProps(column, rowIndex, colspan)"
            />
          </Row>
        </ColumnGroup>

        <ColumnGroup v-if="props.footerRows?.length" key="vuescape-table-footer-rows" type="footer">
          <Row v-for="footerRow in props.footerRows" :key="footerRow.id">
            <Column
              v-for="{ column, cell, colspan } in getSpannedCells(footerRow, localState.columns)"
              :key="column.id"
              :frozen="column.isFrozen"
              :colspan="colspan"
              :footer="cell.displayValue ?? ''"
              :footerStyle="cell.cssStyles"
            />
          </Row>
        </ColumnGroup>
      </DataTable>
    </div>
    <div v-if="props.footnotes?.length" class="vuescape-table__footnotes">
      <div v-for="(footnote, index) in props.footnotes" :key="index">{{ footnote }}</div>
    </div>
  </div>
</template>

<style>
.vuescape-table__footnotes {
  margin-top: 0.5rem;
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
}
.vuescape-table__footnotes > div + div {
  margin-top: 0.25rem;
}
.p-datatable-scrollable .p-datatable-tbody > tr > td.p-datatable-frozen-column {
  background: inherit;
}
/*
 * With gridlines PrimeVue gives each cell only a left border, so the line at the frozen columns' edge is the first
 * scrolling column's, which slides under the frozen columns when the table scrolls. The last shown frozen cell draws
 * that line itself, over the same pixel, so it stays put. A shadow rather than a border, so the cell keeps its width.
 */
.p-datatable-gridlines
  .p-datatable-frozen-column:not(
    :has(~ .p-datatable-frozen-column:not(.vuescape-table__covered-cell))
  ) {
  box-shadow: 1px 0 0 0
    var(--vuescape-table-frozen-edge-color, var(--p-datatable-body-cell-border-color));
}
.p-datatable-gridlines .p-datatable-thead > tr > th.p-datatable-frozen-column {
  --vuescape-table-frozen-edge-color: var(--p-datatable-header-cell-border-color);
}
.p-datatable-gridlines .p-datatable-tfoot > tr > td.p-datatable-frozen-column {
  --vuescape-table-frozen-edge-color: var(--p-datatable-footer-cell-border-color);
}
/* A body cell in a column another cell's span covers (see getBodyCellAttributes) */
.p-datatable-tbody > tr > td.vuescape-table__covered-cell {
  display: none;
}
/*
 * PrimeVue leaves footer cells without a background, so the cells scrolling under a frozen footer cell would show
 * through it. A cell's own style (e.g. a colored total) still wins.
 */
.p-datatable-scrollable .p-datatable-tfoot > tr > td.p-datatable-frozen-column {
  z-index: 1;
  background: var(--p-datatable-footer-cell-background);
}
/*
 * Collapses the header row rather than removing it: its cells still size the columns, and give the frozen cells their
 * offsets (updateFrozenCellOffsets). Through PrimeVue's variables, since its own header cell rules come later and
 * would win a tie.
 */
.vuescape-table--headless {
  --p-datatable-header-cell-padding: 0;
  --p-datatable-header-cell-sm-padding: 0;
  --p-datatable-header-cell-background: transparent;
  --p-datatable-header-cell-border-color: transparent;
}
/*
 * Without gridlines PrimeVue still draws a line under each cell, which is the 'rows' borders. Making it transparent
 * rather than removing it keeps the rows' heights. Through PrimeVue's variables, as for the headless table.
 */
.vuescape-table--borderless {
  --p-datatable-header-cell-border-color: transparent;
  --p-datatable-body-cell-border-color: transparent;
  --p-datatable-footer-cell-border-color: transparent;
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
 * A frozen column (e.g. names) also grows with its text up to the max width, so a table wider than its container
 * doesn't squeeze it to its longest word. Past the max width it wraps rather than cutting off what identifies the row.
 */
.vuescape-table__frozen-cell-text {
  width: max-content;
  max-width: var(--vuescape-table-cell-max-width, 20rem);
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
