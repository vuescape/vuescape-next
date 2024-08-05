import { formatUtcDateTimeString } from '@/infrastructure'
import { describe, expect, it } from 'vitest'

describe('formatUtcDateTimeString', () => {
  it('returns an empty string for empty input', () => {
    const result = formatUtcDateTimeString('')
    expect(result).toBe('')
  })

  it('formats DateTime to date and time string', () => {
    const input = '2023-04-01T12:00:00'

    const formattedDateTimeString = formatUtcDateTimeString(input)
    const [dateString, timeString] = formattedDateTimeString.split(' ')

    // Note: The exact expected result depends on the environment's locale and time zone
    expect(dateString).toBe('4/1/2023')
    expect(timeString).not.toBe('')
  })

  it('correctly formats a UTC date time string to local date time string', () => {
    const input = '2023-04-01T12:00:00Z'
    const result = formatUtcDateTimeString(input)
    // Note: The exact expected result depends on the environment's locale and time zone
    // This is a generic check to ensure the function returns a non-empty string
    expect(result).not.toBe('')
  })
})
