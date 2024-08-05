// @ts-nocheck
import { getSortedHeaderCellWithIndex } from '@/reporting-domain'
import { SortDirection } from '@/reporting-domain/TreeTable'
import { describe, expect, it } from 'vitest'

describe('getSortedHeaderCellWithIndex', () => {
  it('returns undefined if no headers are provided', () => {
    const result = getSortedHeaderCellWithIndex([])
    expect(result).toBeUndefined()
  })

  it('returns undefined if headers are provided but no sorted header cell exists', () => {
    const headers = [{
      cells: [{ columnSorter: { sortDirection: SortDirection.None } }],
    }]
    const result = getSortedHeaderCellWithIndex(headers)
    expect(result).toBeUndefined()
  })

  it('returns the sorted header cell and its index when a sorted cell exists', () => {
    const headers = [{
      cells: [
        { columnSorter: { sortDirection: SortDirection.None } },
        { columnSorter: { sortDirection: SortDirection.Ascending } },
      ],
    }]
    const result = getSortedHeaderCellWithIndex(headers)
    expect(result).toEqual({ cell: headers[0].cells[1], index: 1 })
  })
})
