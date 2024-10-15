import { describe, expect, it } from 'vitest'
import { Guid } from '../../models'

import { base64ToBase64Url, base64UrlToBase64, decodeBase64String, encodeBase64String } from '../converters'

describe('decodeBase64String', () => {
  // Decodes a base64 string to a Uint8Array.
  it('should decode a given base64 string', () => {
    // arrange
    const plainString = Guid.newGuid()
    const base64String = Buffer.from(plainString).toString('base64')

    // act
    const result = decodeBase64String(base64String)

    // assert
    expect(result.every((val, i) => plainString.charCodeAt(i) === val)).toBe(true)
  })
})

describe('encodeBase64String', () => {
  // Decodes a base64 string to a Uint8Array.
  it('should encode a given string', () => {
    // arrange
    const plainString = 'hello world'
    const encodedString = 'aGVsbG8gd29ybGQ='

    // act
    const base64String = encodeBase64String(plainString)

    // assert
    expect(base64String).toBe(encodedString)
  })
})

describe('encodeBase64String and decodeBase64String', () => {
  it('should round-trip string', () => {
    // arrange
    const plainString = 'hello world'

    // act
    const encodedString = encodeBase64String(plainString)
    const decodedString = decodeBase64String(encodedString)

    // assert
    expect(decodedString.every((val, i) => plainString.charCodeAt(i) === val)).toBe(true)
  })
})

describe('base64ToBase64Url', () => {
  it('should convert base64 to base64url format', () => {
    const base64String = 'TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQgdGhhdCBieSBhIHBlcnNldmVyYW5jZSBvZiBkZWxpZ2h0IGluIHRoZSBjb250aW51ZWQgYW5kIGluZGVmYXRpZ2FibGUgZ2VuZXJhdGlvbiBvZiBrbm93bGVkZ2UsIGV4Y2VlZHMgdGhlIHNob3J0IHZlaGVtZW5jZSBvZiBhbnkgY2FybmFsIHBsZWFzdXJlLg=='
    const expected = 'TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQgdGhhdCBieSBhIHBlcnNldmVyYW5jZSBvZiBkZWxpZ2h0IGluIHRoZSBjb250aW51ZWQgYW5kIGluZGVmYXRpZ2FibGUgZ2VuZXJhdGlvbiBvZiBrbm93bGVkZ2UsIGV4Y2VlZHMgdGhlIHNob3J0IHZlaGVtZW5jZSBvZiBhbnkgY2FybmFsIHBsZWFzdXJlLg'
    const result = base64ToBase64Url(base64String)
    expect(result).toBe(expected)
  })
})

describe('base64UrlToBase64', () => {
  it('should convert base64url to base64 format', () => {
    const base64UrlString = 'TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQgdGhhdCBieSBhIHBlcnNldmVyYW5jZSBvZiBkZWxpZ2h0IGluIHRoZSBjb250aW51ZWQgYW5kIGluZGVmYXRpZ2FibGUgZ2VuZXJhdGlvbiBvZiBrbm93bGVkZ2UsIGV4Y2VlZHMgdGhlIHNob3J0IHZlaGVtZW5jZSBvZiBhbnkgY2FybmFsIHBsZWFzdXJlLg'
    const expected = 'TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24sIGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltYWxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQgdGhhdCBieSBhIHBlcnNldmVyYW5jZSBvZiBkZWxpZ2h0IGluIHRoZSBjb250aW51ZWQgYW5kIGluZGVmYXRpZ2FibGUgZ2VuZXJhdGlvbiBvZiBrbm93bGVkZ2UsIGV4Y2VlZHMgdGhlIHNob3J0IHZlaGVtZW5jZSBvZiBhbnkgY2FybmFsIHBsZWFzdXJlLg=='
    const result = base64UrlToBase64(base64UrlString)
    expect(result).toBe(expected)
  })
})
