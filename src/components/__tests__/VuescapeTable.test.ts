import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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
      age: { displayValue: '030', comparableValue: 30 },
      address: { displayValue: '123 Main St' }
    }
  },
  {
    id: '2',
    cells: {
      name: { displayValue: 'Jane Smith' },
      age: { displayValue: '25', comparableValue: 25 },
      address: { displayValue: '456 Elm St' }
    }
  }
])

describe('VuescapeTable.vue', () => {
  it('renders table with correct number of columns and rows', () => {
    const wrapper = mount(VuescapeTable, {
      props: { id: 'test-table', columns: columns.value, rows: rows.value }
    })

    const tableColumns = wrapper.findAllComponents({ name: 'Column' })
    const tableRows = wrapper.findAll('tr')

    expect(tableColumns.length).toBe(columns.value.length)
    expect(tableRows.length).toBe(rows.value.length + 1) // +1 for header row
  })

  it('renders correct cell values', () => {
    const wrapper = mount(VuescapeTable, {
      props: { id: 'test-table', columns: columns.value, rows: rows.value }
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

  it('sorts rows correctly when column header is clicked', async () => {
    const wrapper = mount(VuescapeTable, {
      props: { id: 'test-table', columns: columns.value, rows: rows.value }
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
})
