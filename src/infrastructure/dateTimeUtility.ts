/**
 * Formats a UTC date time string to a local date time string.
 * If the input string does not end with 'Z', it appends 'Z' to the end of the string.
 *
 * @param utcDateTimeString - The UTC date time string to format.
 * @returns The formatted local date time string.
 */
export function formatUtcDateTimeString(utcDateTimeString: string) {
  if (!utcDateTimeString) {
    return ''
  }
  if (utcDateTimeString.slice(-1) !== 'Z') {
    utcDateTimeString += 'Z'
  }

  const dateTime = new Date(utcDateTimeString)
  const result   = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`
  return result
}
