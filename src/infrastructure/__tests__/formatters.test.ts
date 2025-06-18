import { describe, it, expect } from 'vitest'
import { formatSize } from '../formatters'

describe('formatSize', () => {
  it('returns empty string for undefined input', () => {
    expect(formatSize(undefined)).toBe('')
  })

  it('returns empty string for negative input', () => {
    expect(formatSize(-1)).toBe('')
    expect(formatSize(-100)).toBe('')
  })

  it('formats 0 bytes', () => {
    expect(formatSize(0)).toBe('0 Bytes')
  })

  it('formats bytes less than 1 KB', () => {
    expect(formatSize(1)).toBe('1 Bytes')
    expect(formatSize(512)).toBe('512 Bytes')
    expect(formatSize(1023)).toBe('1023 Bytes')
  })

  it('formats exactly 1 KB', () => {
    expect(formatSize(1024)).toBe('1 KB')
  })

  it('formats bytes between 1 KB and 1 MB', () => {
    expect(formatSize(1536)).toBe('2 KB')
    expect(formatSize(10 * 1024)).toBe('10 KB')
    expect(formatSize(1024 * 1024 - 1)).toBe('1024 KB')
  })

  it('formats exactly 1 MB', () => {
    expect(formatSize(1024 * 1024)).toBe('1 MB')
  })

  it('formats bytes between 1 MB and 1 GB', () => {
    expect(formatSize(2 * 1024 * 1024)).toBe('2 MB')
    expect(formatSize(1.5 * 1024 * 1024)).toBe('1.5 MB')
    expect(formatSize(10 * 1024 * 1024)).toBe('10 MB')
  })

  it('formats exactly 1 GB', () => {
    expect(formatSize(1024 * 1024 * 1024)).toBe('1 GB')
  })

  it('formats large sizes (TB, PB, EB, ZB, YB)', () => {
    expect(formatSize(1024 ** 4)).toBe('1 TB')
    expect(formatSize(1024 ** 5)).toBe('1 PB')
    expect(formatSize(1024 ** 6)).toBe('1 EB')
    expect(formatSize(1024 ** 7)).toBe('1 ZB')
    expect(formatSize(1024 ** 8)).toBe('1 YB')
  })

  it('uses custom decimalPlaces if provided', () => {
    expect(formatSize(1536, undefined, 2)).toBe('1.5 KB')
    expect(formatSize(1024 * 1024, undefined, 3)).toBe('1 MB')
    expect(formatSize(123456789, undefined, 4)).toBe('117.7376 MB')
  })

  it('uses custom fileSizeTypes if provided', () => {
    const customUnits = ['B', 'KiB', 'MiB', 'GiB']
    expect(formatSize(1024, customUnits)).toBe('1 KiB')
    expect(formatSize(1024 * 1024, customUnits)).toBe('1 MiB')
  })

  it('handles edge cases for very large numbers', () => {
    expect(formatSize(Number.MAX_SAFE_INTEGER)).toMatch('8 PB')
  })
})
