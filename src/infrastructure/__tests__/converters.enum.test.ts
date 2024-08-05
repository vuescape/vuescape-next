import { describe, expect, it } from 'vitest'
import { toEnum, tryToEnum } from '../converters'

enum TestEnum {
  FirstValue = 'FIRST_VALUE',
  SecondValue = 'SECOND_VALUE',
}

describe('toEnum', () => {
  it('should correctly convert a string to an enum value', () => {
    const result = toEnum(TestEnum, 'FirstValue', false)
    expect(result).toBe(TestEnum.FirstValue)
  })

  it('should correctly convert a string to an enum value when capitalizing first letter', () => {
    const result = toEnum(TestEnum, 'firstValue', true)
    expect(result).toBe(TestEnum.FirstValue)
  })

  it('should throw an error for an invalid enum string', () => {
    const invalidEnumString = 'invalid_value'
    expect(() => toEnum(TestEnum, invalidEnumString, false)).toThrowError()
  })
})

describe('tryToEnum', () => {
  it('should correctly convert a string to an enum value', () => {
    const result = tryToEnum(TestEnum, 'SecondValue', false)
    expect(result).toBe(TestEnum.SecondValue)
  })

  it('should return undefined for an undefined enum string', () => {
    const result = tryToEnum(TestEnum, undefined, false)
    expect(result).toBe(undefined)
  })

  it('should return undefined for an invalid enum string', () => {
    const invalidEnumString = 'invalid_value'
    expect(() => tryToEnum(TestEnum, invalidEnumString, false)).toThrowError()

  })
})
