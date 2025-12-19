import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import { ref } from 'vue'
import type { TableColumn } from '../../models'
import type { TableRow } from '../../models/dynamic-ui/TableRow'
import VuescapeTable from '../VuescapeTable.vue'

const columns = ref<Array<TableColumn>>([
  { id: 'name', headerText: 'Name', isSortable: true },
  { id: 'age', headerText: 'Age', isSortable: true },
  { id: 'address', headerText: 'Address', isSortable: false }
])

const rows = ref<Array<TableRow>>([
  {
    id: '1',
    cells: {
      name: { displayValue: 'John Doe' },
      age: { displayValue: '030', comparableValue: { numericValue: 30 } },
      address: { displayValue: '123 Main St' }
    }
  },
  {
    id: '2',
    cells: {
      name: { displayValue: 'Jane Smith' },
      age: { displayValue: '25', comparableValue: { numericValue: 25 } },
      address: { displayValue: '456 Elm St' }
    }
  },
  {
    id: '3',
    cells: {
      name: { displayValue: '' }, // Empty string test case
      age: { displayValue: '35', comparableValue: { numericValue: 35 } },
      address: { displayValue: '789 Oak Ave' }
    }
  },
  {
    id: '4',
    cells: {
      name: { displayValue: 'Alice Brown' },
      age: { displayValue: '', comparableValue: { numericValue: 0 } }, // Empty displayValue with comparableValue
      address: { displayValue: '' } // Empty address
    }
  }
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
        initialScrollPosition: 0
      }
    })

    const tableColumns = wrapper.findAllComponents({ name: 'Column' })
    expect(tableColumns.length).toBe(columns.value.length)
  })

  // TODO: test virtual scroller implementation since table data is not in the body of the table.
  it.todo('renders correct cell values', () => {
    const wrapper = mount(VuescapeTable, {
      props: {
        id: 'test-table',
        columns: columns.value,
        rows: rows.value,
        initialScrollPosition: 0
      }
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
        initialScrollPosition: 0
      }
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
        initialScrollPosition: 0
      }
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
        initialScrollPosition: 0
      }
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
            comparableValue: { stringValue: '' } // Empty comparable value
          }
        }
      },
      {
        id: '2', 
        cells: {
          name: {
            displayValue: 'Another File',
            comparableValue: { stringValue: 'another-file.txt' }
          }
        }
      }
    ]

    const wrapper = mount(VuescapeTable, {
      props: {
        id: 'test-table-comparable',
        columns: [{ id: 'name', headerText: 'Name', isSortable: true }],
        rows: testRowsWithEmptyComparable,
        initialScrollPosition: 0
      }
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
          size: { displayValue: '100KB' }
        }
      },
      {
        id: '2',
        cells: {
          name: { displayValue: 'File B' },
          size: { displayValue: '200KB' }
        }
      }
    ]

    const wrapper = mount(VuescapeTable, {
      props: {
        id: 'test-table-no-empty',
        columns: [
          { id: 'name', headerText: 'Name', isSortable: true },
          { id: 'size', headerText: 'Size', isSortable: true }
        ],
        rows: testRowsNoEmpty,
        initialScrollPosition: 0
      }
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
