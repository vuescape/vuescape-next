import { describe, it, expect } from 'vitest'
import { fastHash } from '../fastHash'

describe('fastHash', () => {
  it('returns a string', () => {
    const result = fastHash({ a: 1 })
    expect(typeof result).toBe('string')
  })

  it('returns the same hash for identical objects', () => {
    const obj1 = { a: 1, b: 'test', c: [1, 2, 3] }
    const obj2 = { a: 1, b: 'test', c: [1, 2, 3] }
    expect(fastHash(obj1)).toBe(fastHash(obj2))
  })

  it('returns different hashes for different objects', () => {
    const obj1 = { a: 1 }
    const obj2 = { a: 2 }
    expect(fastHash(obj1)).not.toBe(fastHash(obj2))
  })

  it('returns different hashes for different property order', () => {
    // JSON.stringify preserves property order, so hashes will differ
    const obj1 = { a: 1, b: 2 }
    const obj2 = { b: 2, a: 1 }
    expect(fastHash(obj1)).not.toBe(fastHash(obj2))
  })

  it('handles primitive values', () => {
    expect(typeof fastHash(123)).toBe('string')
    expect(typeof fastHash('abc')).toBe('string')
    expect(typeof fastHash(true)).toBe('string')
    expect(typeof fastHash(null)).toBe('string')
    expect(typeof fastHash(undefined)).toBe('string')
  })

  it('handles arrays', () => {
    expect(typeof fastHash([1, 2, 3])).toBe('string')
    expect(fastHash([1, 2, 3])).not.toBe(fastHash([3, 2, 1]))
  })

  it('produces a base64-encoded string', () => {
    const hash = fastHash({ foo: 'bar' })
    // base64 strings only contain A-Z, a-z, 0-9, +, /, and possibly =
    expect(/^[A-Za-z0-9+/=]+$/.test(hash)).toBe(true)
  })
})
