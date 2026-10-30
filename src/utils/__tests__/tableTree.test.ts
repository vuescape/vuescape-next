import { describe, expect, it } from 'vitest'

import type { TableRow } from '../../models/dynamic-ui/TableRow'
import {
  compareSortValues,
  flattenVisibleRows,
  getAllRows,
  getInitiallyExpandedRowIds,
  isTree,
  resolveFieldPath,
  sortTree,
} from '../tableTree'

function row(id: string, childRows?: Array<TableRow>, isExpanded?: boolean): TableRow {
  return { id, cells: { name: { displayValue: id } }, childRows, isExpanded }
}

// a
//   a1
//     a1x
//   a2
// b
const tree = [row('a', [row('a1', [row('a1x')]), row('a2')]), row('b')]

describe('isTree', () => {
  it('should be true only when a row has child rows', () => {
    expect(isTree(tree)).toBe(true)
    expect(isTree([row('a', []), row('b')])).toBe(false)
  })
})

describe('getAllRows', () => {
  it('should list every row with parents before their children', () => {
    expect(getAllRows(tree).map((r) => r.id)).toEqual(['a', 'a1', 'a1x', 'a2', 'b'])
  })
})

describe('getInitiallyExpandedRowIds', () => {
  it('should include the expanded rows that have child rows, at any depth', () => {
    // Arrange
    const rows = [row('a', [row('a1', [row('a1x')], true)], true), row('b', undefined, true)]

    // Act
    const actual = getInitiallyExpandedRowIds(rows)

    // Assert
    expect([...actual]).toEqual(['a', 'a1'])
  })
})

describe('flattenVisibleRows', () => {
  it('should show only the top-level rows when nothing is expanded', () => {
    // Act
    const actual = flattenVisibleRows(tree, new Set())

    // Assert
    expect(actual.map((r) => [r.id, r.depth, r.hasChildRows, r.isExpanded])).toEqual([
      ['a', 0, true, false],
      ['b', 0, false, false],
    ])
  })

  it('should show the child rows of expanded rows under their parent', () => {
    // Act
    const actual = flattenVisibleRows(tree, new Set(['a', 'a1']))

    // Assert
    expect(actual.map((r) => [r.id, r.depth, r.isExpanded])).toEqual([
      ['a', 0, true],
      ['a1', 1, true],
      ['a1x', 2, false],
      ['a2', 1, false],
      ['b', 0, false],
    ])
  })

  it('should hide the child rows of an expanded row whose parent is collapsed', () => {
    // Act
    const actual = flattenVisibleRows(tree, new Set(['a1']))

    // Assert
    expect(actual.map((r) => r.id)).toEqual(['a', 'b'])
  })
})

describe('sortTree', () => {
  const getName = (r: TableRow) => r.cells.name.displayValue

  it('should sort siblings among themselves and keep child rows under their parent', () => {
    // Arrange
    const rows = [row('b', [row('b2'), row('b1')]), row('a', [row('a2'), row('a1')])]

    // Act
    const actual = sortTree(rows, getName, -1)

    // Assert
    expect(getAllRows(actual).map((r) => r.id)).toEqual(['b', 'b2', 'b1', 'a', 'a2', 'a1'])
  })

  it('should not change the rows it is given', () => {
    // Arrange
    const rows = [row('b', [row('b2'), row('b1')]), row('a')]

    // Act
    sortTree(rows, getName, 1)

    // Assert
    expect(getAllRows(rows).map((r) => r.id)).toEqual(['b', 'b2', 'b1', 'a'])
  })
})

describe('compareSortValues', () => {
  it.each([
    ['item 2', 'item 10', 1, -1],
    ['item 2', 'item 10', -1, 1],
    [3, 20, 1, -1],
    [3, 20, -1, 1],
    [5, 5, 1, 0],
  ])('should compare %s with %s in order %i as %i', (value1, value2, sortOrder, expected) => {
    expect(Math.sign(compareSortValues(value1, value2, sortOrder))).toBe(expected)
  })

  it.each([1, -1])('should put empty values last in order %i, like DataTable', (sortOrder) => {
    expect(compareSortValues(null, 1, sortOrder)).toBeGreaterThan(0)
    expect(compareSortValues('a', '', sortOrder)).toBeLessThan(0)
    expect(compareSortValues(undefined, null, sortOrder)).toBe(0)
  })
})

describe('resolveFieldPath', () => {
  it('should read a dot-separated path and give undefined for a missing one', () => {
    // Arrange
    const value = { cells: { age: { comparableValue: { numericValue: 30 } } } }

    // Act & Assert
    expect(resolveFieldPath(value, 'cells.age.comparableValue.numericValue')).toBe(30)
    expect(resolveFieldPath(value, 'cells.name.displayValue')).toBeUndefined()
  })
})
