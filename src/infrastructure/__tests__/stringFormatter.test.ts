import { describe, expect, it } from 'vitest'
import { capitalizeFirstCharacter } from '../stringFormatter'

describe('capitalizeFirstCharacter', () => {
  it('should capitalize the first character of a lowercase string', () => {
    const result = capitalizeFirstCharacter('hello')
    expect(result).toBe('Hello')
  })

  it('should return the same string if the first character is already capitalized', () => {
    const result = capitalizeFirstCharacter('Hello')
    expect(result).toBe('Hello')
  })

  it('should handle an empty string', () => {
    const result = capitalizeFirstCharacter('')
    expect(result).toBe('')
  })

  it('should handle a string with only one character', () => {
    const result = capitalizeFirstCharacter('a')
    expect(result).toBe('A')
  })

  it('should handle a string with special characters', () => {
    const result = capitalizeFirstCharacter('!hello')
    expect(result).toBe('!hello')
  })

  it('should handle a string with spaces', () => {
    const result = capitalizeFirstCharacter(' hello')
    expect(result).toBe(' hello')
  })

  it('should handle null input', () => {
    const result = capitalizeFirstCharacter(null as unknown as string)
    expect(result).toBe('')
  })

  it('should handle undefined input', () => {
    const result = capitalizeFirstCharacter(undefined as unknown as string)
    expect(result).toBe('')
  })
})
