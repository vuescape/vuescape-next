import { describe, expect, it } from 'vitest'

import type { TableColumn } from '../../models/dynamic-ui/TableColumn'
import { getHeaderRows, getSpannedCells } from '../tableHeaderRows'

const columns: Array<TableColumn> = [
  { id: 'name', headerText: 'Name' },
  { id: 'q1', headerText: 'Q1' },
  { id: 'q2', headerText: 'Q2' },
  { id: 'status', headerText: 'Status' },
]

describe('getSpannedCells', () => {
  it('should skip the columns a cell spans, and give an uncovered column without a cell an empty one', () => {
    // Arrange
    const row = {
      id: 'group',
      cells: { name: { displayValue: 'Total: 41' }, q1: { displayValue: 'Quarters', colspan: 2 } },
    }
    const systemUnderTest = getSpannedCells

    // Act
    const actual = systemUnderTest(row, columns)

    // Assert
    expect(
      actual.map((spanned) => [spanned.column.id, spanned.cell.displayValue, spanned.colspan]),
    ).toEqual([
      ['name', 'Total: 41', 1],
      ['q1', 'Quarters', 2],
      ['status', undefined, 1],
    ])
  })

  it('should cut a span short at the last column', () => {
    const row = { id: 'note', cells: { q2: { displayValue: 'Note', colspan: 5 } } }

    expect(getSpannedCells(row, columns).map((spanned) => spanned.colspan)).toEqual([1, 1, 2])
  })
})

describe('getHeaderRows', () => {
  it(`should use the table's own header rows, even none`, () => {
    const headerRows = [{ id: 'columns', cells: { name: { displayValue: 'Organization' } } }]

    expect(getHeaderRows(headerRows, columns)).toBe(headerRows)
    expect(getHeaderRows([], columns)).toEqual([])
  })

  it(`should make one row of the columns' header text when the table has no header rows`, () => {
    const actual = getHeaderRows(undefined, columns)

    expect(actual).toHaveLength(1)
    expect(actual[0].cells).toEqual({
      name: { displayValue: 'Name' },
      q1: { displayValue: 'Q1' },
      q2: { displayValue: 'Q2' },
      status: { displayValue: 'Status' },
    })
  })

  it('should have no header when no column has header text', () => {
    expect(getHeaderRows(null, [{ id: 'link' }])).toEqual([])
  })
})
