import { mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import type { TableColumn } from '../../models'
import type { TableRow } from '../../models/dynamic-ui/TableRow'
import { APPEND_ONLY_MAX_CELLS } from '../../utils/tableLayout'
import { VuescapeTableScrollHeightKey } from '../injectionKeys'
import DataTable from 'primevue/datatable'
import VuescapeTable from '../VuescapeTable.vue'

const columns = ref<Array<TableColumn>>([
  { id: 'name', headerText: 'Name', isSortable: true },
  { id: 'age', headerText: 'Age', isSortable: true },
  { id: 'address', headerText: 'Address', isSortable: false },
])

const rows = ref<Array<TableRow>>([
  {
    id: '1',
    cells: {
      name: { displayValue: 'John Doe' },
      age: { displayValue: '030', comparableValue: { numericValue: 30 } },
      address: { displayValue: '123 Main St' },
    },
  },
  {
    id: '2',
    cells: {
      name: { displayValue: 'Jane Smith' },
      age: { displayValue: '25', comparableValue: { numericValue: 25 } },
      address: { displayValue: '456 Elm St' },
    },
  },
  {
    id: '3',
    cells: {
      name: { displayValue: '' }, // Empty string test case
      age: { displayValue: '35', comparableValue: { numericValue: 35 } },
      address: { displayValue: '789 Oak Ave' },
    },
  },
  {
    id: '4',
    cells: {
      name: { displayValue: 'Alice Brown' },
      age: { displayValue: '', comparableValue: { numericValue: 0 } }, // Empty displayValue with comparableValue
      address: { displayValue: '' }, // Empty address
    },
  },
])

describe('VuescapeTable.vue', () => {
  // Add ResizeObserver mock
  beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  })

  it('renders table with correct number of columns', () => {
    const wrapper = mount(VuescapeTable, {
      props: {
        id: 'test-table',
        columns: columns.value,
        rows: rows.value,
        initialScrollPosition: 0,
      },
    })

    const tableColumns = wrapper.findAllComponents({ name: 'Column' })
    expect(tableColumns.length).toBe(columns.value.length)
  })

  it('should show footer rows below the rows, with a cell for each column', () => {
    // Arrange
    const footerRows: Array<TableRow> = [
      {
        id: 'total',
        cells: {
          name: { displayValue: 'Total' },
          age: { displayValue: '90', cssStyles: { backgroundColor: 'rgb(144, 238, 144)' } },
          address: {},
        },
      },
    ]

    // Act
    const wrapper = mount(VuescapeTable, {
      props: {
        id: 'footer-table',
        columns: columns.value,
        rows: rows.value,
        footerRows,
        initialScrollPosition: 0,
      },
    })

    // Assert
    const footerCells = wrapper.findAll('tfoot td')
    expect(footerCells.map((cell) => cell.text())).toEqual(['Total', '90', ''])
    expect(footerCells[1].attributes('style')).toContain('background-color: rgb(144, 238, 144)')
  })

  describe('scroll height', () => {
    it('should use a height provided by an ancestor, e.g. a dialog, instead of filling the page', async () => {
      // Arrange
      const wrapper = mount(VuescapeTable, {
        props: {
          id: 'test-table',
          columns: columns.value,
          rows: rows.value,
          initialScrollPosition: 0,
        },
        global: { provide: { [VuescapeTableScrollHeightKey as symbol]: 'min(320px, 50vh)' } },
      })

      // Act: let the deferred measurement run, which must not override the provided height
      await new Promise((resolve) => setTimeout(resolve, 0))

      // Assert
      expect(wrapper.findComponent({ name: 'DataTable' }).props('scrollHeight')).toBe(
        'min(320px, 50vh)',
      )
    })

    it('should follow a provided height that changes, e.g. as a dialog it fills resizes', async () => {
      // Arrange
      const tableScrollHeight = ref('200px')
      const wrapper = mount(VuescapeTable, {
        props: {
          id: 'test-table',
          columns: columns.value,
          rows: rows.value,
          initialScrollPosition: 0,
        },
        global: { provide: { [VuescapeTableScrollHeightKey as symbol]: tableScrollHeight } },
      })

      // Act
      tableScrollHeight.value = '300px'
      await nextTick()

      // Assert
      expect(wrapper.findComponent({ name: 'DataTable' }).props('scrollHeight')).toBe('300px')
    })
  })

  describe('virtual scroller', () => {
    const columnCount = 10

    function mountWithRowCount(rowCount: number) {
      const wideColumns: Array<TableColumn> = Array.from({ length: columnCount }, (_, index) => ({
        id: `column${index}`,
        headerText: `Column ${index}`,
      }))
      const manyRows: Array<TableRow> = Array.from({ length: rowCount }, (_, rowIndex) => ({
        id: `${rowIndex}`,
        cells: Object.fromEntries(
          wideColumns.map((column) => [column.id, { displayValue: `${rowIndex}` }]),
        ),
      }))

      return mount(VuescapeTable, {
        props: {
          id: 'test-table-virtual-scroller',
          columns: wideColumns,
          rows: manyRows,
          initialScrollPosition: 0,
        },
      })
    }

    it('should only append rows up to the cell threshold, so wrapped rows do not drift', () => {
      // Act
      const wrapper = mountWithRowCount(APPEND_ONLY_MAX_CELLS / columnCount)

      // Assert
      expect(wrapper.findComponent({ name: 'VirtualScroller' }).props('appendOnly')).toBe(true)
    })

    it('should recycle rows above the cell threshold, to keep the page small', () => {
      // Act
      const wrapper = mountWithRowCount(APPEND_ONLY_MAX_CELLS / columnCount + 1)

      // Assert
      expect(wrapper.findComponent({ name: 'VirtualScroller' }).props('appendOnly')).toBe(false)
    })
  })

  // TODO: test virtual scroller implementation since table data is not in the body of the table.
  it.todo('renders correct cell values', () => {
    const wrapper = mount(VuescapeTable, {
      props: {
        id: 'test-table',
        columns: columns.value,
        rows: rows.value,
        initialScrollPosition: 0,
      },
    })

    for (let rowIndex = 0; rowIndex < rows.value.length - 1; rowIndex++) {
      const rowCells = wrapper.findAll(`tr[data-p-index="${rowIndex}"] td`)
      expect(rowCells.length).toBe(columns.value.length)

      const row = rows.value[rowIndex]
      for (let cellIndex = 0; cellIndex < rowCells.length - 1; cellIndex++) {
        const rowCell = rowCells[cellIndex]
        const cell = row.cells[columns.value[cellIndex].id]
        expect(rowCell.text()).toBe(cell.displayValue)
      }
    }
  })

  // TODO: test virtual scroller implementation since table data is not in the body of the table.
  it.todo('sorts rows correctly when column header is clicked', async () => {
    const wrapper = mount(VuescapeTable, {
      props: {
        id: 'test-table',
        columns: columns.value,
        rows: rows.value,
        initialScrollPosition: 0,
      },
    })
    const headers = wrapper.findAll('th[data-p-sortable-column="true"]')
    await headers[0].trigger('click')
    const sortedRows = wrapper.findAll('tbody tr')
    expect(sortedRows[0].findAll('td')[0].text()).toBe(rows.value[1].cells['name'].displayValue)
    expect(sortedRows[1].findAll('td')[0].text()).toBe(rows.value[0].cells['name'].displayValue)

    await headers[0].trigger('click')
    const sortedRows2 = wrapper.findAll('tbody tr')
    expect(sortedRows2[0].findAll('td')[0].text()).toBe(rows.value[0].cells['name'].displayValue)
    expect(sortedRows2[1].findAll('td')[0].text()).toBe(rows.value[1].cells['name'].displayValue)
  })

  it('handles empty string sorting with null character preprocessing', () => {
    const wrapper = mount(VuescapeTable, {
      props: {
        id: 'test-table-empty-strings',
        columns: columns.value,
        rows: rows.value,
        initialScrollPosition: 0,
      },
    })

    // Access the component instance to test the enhancedRows computed property
    const vm = wrapper.vm as any

    // Test that enhancedRows replaces empty strings with null characters for sorting
    const enhanced = vm.enhancedRows
    expect(enhanced.length).toBe(4)

    // Find the row with empty name (row with id '3')
    const emptyNameRow = enhanced.find((row: any) => row.id === '3')
    expect(emptyNameRow).toBeDefined()
    expect(emptyNameRow.cells.name.displayValue).toBe('\u0000') // Should be null character for sorting

    // Find the row with empty age displayValue but numeric comparableValue (row with id '4')
    const emptyAgeDisplayRow = enhanced.find((row: any) => row.id === '4')
    expect(emptyAgeDisplayRow).toBeDefined()
    expect(emptyAgeDisplayRow.cells.age.displayValue).toBe('\u0000') // Should be null character for sorting
    expect(emptyAgeDisplayRow.cells.age.comparableValue.numericValue).toBe(0) // Numeric value should remain unchanged

    // Non-empty values should remain unchanged
    const johnRow = enhanced.find((row: any) => row.id === '1')
    expect(johnRow.cells.name.displayValue).toBe('John Doe') // Should remain unchanged
  })

  it('displays empty strings correctly in UI despite null character preprocessing', () => {
    const wrapper = mount(VuescapeTable, {
      props: {
        id: 'test-table-display',
        columns: columns.value,
        rows: rows.value,
        initialScrollPosition: 0,
      },
    })

    // Access the component instance to test getDisplayValue function
    const vm = wrapper.vm as any

    // Test that getDisplayValue converts null characters back to empty strings
    const emptyNameRow = vm.enhancedRows.find((row: any) => row.id === '3')
    expect(emptyNameRow).toBeDefined()
    expect(emptyNameRow.cells.name).toBeDefined()

    const displayValue = vm.getDisplayValue(emptyNameRow, 'name')
    expect(displayValue).toBe('') // Should display as empty string, not null character

    // Test normal values are unaffected
    const johnRow = vm.enhancedRows.find((row: any) => row.id === '1')
    expect(johnRow).toBeDefined()
    expect(johnRow.cells.name).toBeDefined()

    const johnDisplayValue = vm.getDisplayValue(johnRow, 'name')
    expect(johnDisplayValue).toBe('John Doe')
  })

  it('handles comparableValue.stringValue empty strings correctly', () => {
    // Create test data with empty comparableValue.stringValue
    const testRowsWithEmptyComparable = [
      {
        id: '1',
        cells: {
          name: {
            displayValue: 'Test File',
            comparableValue: { stringValue: '' }, // Empty comparable value
          },
        },
      },
      {
        id: '2',
        cells: {
          name: {
            displayValue: 'Another File',
            comparableValue: { stringValue: 'another-file.txt' },
          },
        },
      },
    ]

    const wrapper = mount(VuescapeTable, {
      props: {
        id: 'test-table-comparable',
        columns: [{ id: 'name', headerText: 'Name', isSortable: true }],
        rows: testRowsWithEmptyComparable,
        initialScrollPosition: 0,
      },
    })

    const vm = wrapper.vm as any
    const enhanced = vm.enhancedRows

    // Find row with empty comparableValue.stringValue
    const emptyComparableRow = enhanced.find((row: any) => row.id === '1')
    expect(emptyComparableRow.cells.name.comparableValue.stringValue).toBe('\u0000')
    expect(emptyComparableRow.cells.name.displayValue).toBe('Test File') // Display value should remain unchanged

    // Non-empty comparableValue should remain unchanged
    const normalRow = enhanced.find((row: any) => row.id === '2')
    expect(normalRow.cells.name.comparableValue.stringValue).toBe('another-file.txt')
  })

  it('only processes rows that actually have empty strings for performance', () => {
    // Create test data with no empty strings
    const testRowsNoEmpty = [
      {
        id: '1',
        cells: {
          name: { displayValue: 'File A' },
          size: { displayValue: '100KB' },
        },
      },
      {
        id: '2',
        cells: {
          name: { displayValue: 'File B' },
          size: { displayValue: '200KB' },
        },
      },
    ]

    const wrapper = mount(VuescapeTable, {
      props: {
        id: 'test-table-no-empty',
        columns: [
          { id: 'name', headerText: 'Name', isSortable: true },
          { id: 'size', headerText: 'Size', isSortable: true },
        ],
        rows: testRowsNoEmpty,
        initialScrollPosition: 0,
      },
    })

    const vm = wrapper.vm as any
    const enhanced = vm.enhancedRows

    // When no empty strings exist, enhanced rows should be identical to original
    expect(enhanced[0].cells.name.displayValue).toBe('File A')
    expect(enhanced[1].cells.name.displayValue).toBe('File B')
    expect(enhanced[0].cells.size.displayValue).toBe('100KB')
    expect(enhanced[1].cells.size.displayValue).toBe('200KB')

    // No null characters should be present
    enhanced.forEach((row: any) => {
      Object.values(row.cells).forEach((cell: any) => {
        expect(cell.displayValue).not.toBe('\u0000')
      })
    })

    // Check comparableValue.stringValue separately
    const cellsWithComparableStringValue: any[] = []
    enhanced.forEach((row: any) => {
      Object.values(row.cells).forEach((cell: any) => {
        if (cell.comparableValue?.stringValue !== undefined) {
          cellsWithComparableStringValue.push(cell)
        }
      })
    })

    cellsWithComparableStringValue.forEach((cell: any) => {
      expect(cell.comparableValue.stringValue).not.toBe('\u0000')
    })
  })
})

describe('VuescapeTable.vue as a tree', () => {
  const treeColumns: Array<TableColumn> = [{ id: 'name', headerText: 'Name', isSortable: true }]

  function treeRow(id: string, childRows?: Array<TableRow>, isExpanded?: boolean): TableRow {
    return { id, cells: { name: { displayValue: id } }, childRows, isExpanded }
  }

  function mountTree(treeRows: Array<TableRow>) {
    return mount(VuescapeTable, {
      props: { id: 'tree-table', columns: treeColumns, rows: treeRows, initialScrollPosition: 0 },
    })
  }

  function getShownRowIds(wrapper: ReturnType<typeof mountTree>) {
    return (wrapper.findComponent(DataTable).props('value') as Array<TableRow>).map((row) => row.id)
  }

  // jsdom lays nothing out, so the virtual scroller would think it is hidden and render no rows. Make elements
  // look visible and sized so it renders them. A test can change the width every element reports.
  let elementWidth = 500
  const layout: Record<string, () => unknown> = {
    offsetParent: () => document.body,
    offsetHeight: () => 500,
    offsetWidth: () => elementWidth,
  }
  const originalLayout = Object.keys(layout).map(
    (name) => [name, Object.getOwnPropertyDescriptor(HTMLElement.prototype, name)!] as const,
  )
  beforeAll(() => {
    Object.entries(layout).forEach(([name, get]) =>
      Object.defineProperty(HTMLElement.prototype, name, { configurable: true, get }),
    )
  })
  afterEach(() => {
    elementWidth = 500
    vi.unstubAllGlobals()
  })
  afterAll(() => {
    originalLayout.forEach(([name, descriptor]) =>
      Object.defineProperty(HTMLElement.prototype, name, descriptor),
    )
  })

  it('should show the child rows of expanded rows and let the user toggle a row', async () => {
    // Arrange
    const wrapper = mountTree([treeRow('a', [treeRow('a1')]), treeRow('b', [treeRow('b1')], true)])
    await nextTick()

    // Assert
    expect(getShownRowIds(wrapper)).toEqual(['a', 'b', 'b1'])

    // Act
    await wrapper.find('button[aria-label="Expand row"]').trigger('click')

    // Assert
    expect(getShownRowIds(wrapper)).toEqual(['a', 'a1', 'b', 'b1'])
    expect(wrapper.findAll('button[aria-expanded="true"]')).toHaveLength(2)
  })

  it('should indent each row by its depth', async () => {
    // Arrange
    const wrapper = mountTree([treeRow('a', [treeRow('a1')], true)])
    await nextTick()

    // Act
    const depths = wrapper
      .findAll('.vuescape-table__row-toggle')
      .map((toggle) =>
        (toggle.element as HTMLElement).style.getPropertyValue('--vuescape-table-tree-depth'),
      )

    // Assert
    expect(depths).toEqual(['0', '1'])
  })

  it('should sort each level among itself when a column header is clicked', async () => {
    // Arrange
    const wrapper = mountTree([
      treeRow('b', [treeRow('b2'), treeRow('b1')], true),
      treeRow('a', [treeRow('a2'), treeRow('a1')], true),
    ])

    // Act
    await wrapper.find('th[data-p-sortable-column="true"]').trigger('click')

    // Assert
    expect(wrapper.findComponent(DataTable).props('lazy')).toBe(true)
    expect(getShownRowIds(wrapper)).toEqual(['a', 'a1', 'a2', 'b', 'b1', 'b2'])
  })

  const frozenColumns: Array<TableColumn> = [
    { id: 'name', headerText: 'Name', isFrozen: true },
    { id: 'abbr', headerText: 'Abbr', isFrozen: true },
  ]

  function frozenRow(id: string, childRows?: Array<TableRow>): TableRow {
    return {
      id,
      cells: { name: { displayValue: id }, abbr: { displayValue: id } },
      childRows,
      isExpanded: !!childRows,
    }
  }

  function mountFrozen(frozenRows: Array<TableRow>) {
    return mount(VuescapeTable, {
      props: {
        id: 'frozen-table',
        columns: frozenColumns,
        rows: frozenRows,
        initialScrollPosition: 0,
      },
    })
  }

  it('should keep the frozen header cells in line with the body when collapsing a row narrows a column', async () => {
    // Arrange
    const wrapper = mountFrozen([frozenRow('a', [frozenRow('a1')])])
    await nextTick()
    const abbrHeader = wrapper.findAll('thead th')[1].element as HTMLElement
    expect(abbrHeader.style.insetInlineStart).toBe('500px')
    // Hiding the wide child row narrows the first column
    elementWidth = 300

    // Act
    await wrapper.find('button[aria-label="Collapse row"]').trigger('click')

    // Assert
    expect(abbrHeader.style.insetInlineStart).toBe('300px')
  })

  it('should keep the frozen cells in line with their columns when resizing the table changes the column widths', async () => {
    // Arrange
    // Other components observe their own elements, so keep each observer's callback by the element it observes
    const resizeCallbacks = new Map<Element, () => void>()
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(private readonly callback: () => void) {}
        observe(target: Element) {
          resizeCallbacks.set(target, this.callback)
        }
        unobserve() {}
        disconnect() {}
      },
    )
    const wrapper = mountFrozen([frozenRow('a'), frozenRow('b')])
    const resizeTable = () => resizeCallbacks.get(wrapper.find('table').element)?.()
    await nextTick()
    const abbrCells = wrapper
      .findAll('tr')
      .map((row) => row.findAll('.p-datatable-frozen-column')[1].element as HTMLElement)
    expect(abbrCells.map((cell) => cell.style.insetInlineStart)).toEqual([
      '500px',
      '500px',
      '500px',
    ])
    // A narrower window narrows the first column
    elementWidth = 300

    // Act
    resizeTable()

    // Assert
    expect(abbrCells.map((cell) => cell.style.insetInlineStart)).toEqual([
      '300px',
      '300px',
      '300px',
    ])
  })

  describe('long text', () => {
    function mountWithNotes(notes: Array<string>) {
      return mount(VuescapeTable, {
        props: {
          id: 'notes-table',
          columns: [
            { id: 'name', headerText: 'Name', isFrozen: true },
            { id: 'notes', headerText: 'Notes' },
          ],
          rows: notes.map((note, index) => ({
            id: `${index}`,
            cells: { name: { displayValue: `Name ${index}` }, notes: { displayValue: note } },
          })),
          initialScrollPosition: 0,
        },
      })
    }

    // jsdom lays nothing out, so give the text the widths a browser would
    function setTextWidths(textEl: Element, scrollWidth: number, clientWidth: number) {
      Object.defineProperty(textEl, 'scrollWidth', { configurable: true, value: scrollWidth })
      Object.defineProperty(textEl, 'clientWidth', { configurable: true, value: clientWidth })
    }

    it('should keep the text of non-frozen columns to one line, so rows keep the fixed row height', async () => {
      // Act
      const wrapper = mountWithNotes(['A long note'])
      await nextTick()

      // Assert
      const [nameCell, notesCell] = wrapper.findAll('tbody td')
      expect(notesCell.find('.vuescape-table__cell-text').text()).toBe('A long note')
      expect(nameCell.find('.vuescape-table__cell-text').exists()).toBe(false)
      expect(nameCell.text()).toBe('Name 0')
    })

    it('should show the full text as a tooltip only when it is cut off', async () => {
      // Arrange
      const wrapper = mountWithNotes(['A note cut off', 'A note that fits'])
      await nextTick()
      const [cutOffText, fittingText] = wrapper.findAll('.vuescape-table__cell-text')
      setTextWidths(cutOffText.element, 400, 320)
      setTextWidths(fittingText.element, 200, 200)

      // Act
      await cutOffText.trigger('mouseenter')
      await fittingText.trigger('mouseenter')

      // Assert
      expect(cutOffText.attributes('title')).toBe('A note cut off')
      expect(fittingText.attributes('title')).toBe('')
    })
  })

  it('should not be lazy or show toggles when no row has child rows', async () => {
    // Act
    const wrapper = mountTree([treeRow('a'), treeRow('b')])
    await nextTick()

    // Assert
    expect(wrapper.findComponent(DataTable).props('lazy')).toBe(false)
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.find('.vuescape-table__row-toggle').exists()).toBe(false)
  })
})
