import { describe, expect, it } from 'vitest'
import { SortComparisonStrategy } from '../SortComparisonStrategy'
import { makePropertyComparer } from '../comparison'

describe('Testing makePropertyComparer function', () => {
  // Arrange
  const sortOnProperty = 'property'
  const objs = [{ property: 'def' }, { property: 'ghi' }, { property: 'Abc' }, { property: 'abc' }]
  const objs2 = [{ property: 'def' }, { property: 'ghi' }, { property: 'abc' }, { property: 'Abc' }]

  // Act and Assert
  it('Default comparison strategy.', () => {
    const comparer = makePropertyComparer(sortOnProperty)
    const sortedObjs = objs.sort(comparer)
    expect(sortedObjs[0].property).toEqual('Abc')
    expect(sortedObjs[2].property).toEqual('def')
  })

  it('String ordinal comparison strategy.', () => {
    const comparer = makePropertyComparer(sortOnProperty, SortComparisonStrategy.StringOrdinal)
    const sortedObjs = objs.sort(comparer)
    expect(sortedObjs[0].property).toEqual('Abc')
    expect(sortedObjs[2].property).toEqual('def')
  })

  it('String case-insensitive comparison strategy.', () => {
    const comparer = makePropertyComparer(
      sortOnProperty,
      SortComparisonStrategy.StringCaseInsensitive
    )
    const sortedObjs1 = objs.sort(comparer)
    const sortedObjs2 = objs2.sort(comparer)

    expect(sortedObjs1[0].property).toEqual('Abc')
    expect(sortedObjs1[1].property).toEqual('abc')

    expect(sortedObjs2[0].property).toEqual('abc')
    expect(sortedObjs2[1].property).toEqual('Abc')
  })

  it('Throws error on unsupported comparison strategy.', () => {
    expect(() => makePropertyComparer(sortOnProperty, SortComparisonStrategy.None)).toThrow()
  })
})
