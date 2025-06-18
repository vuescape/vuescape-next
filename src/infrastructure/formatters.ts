/**
 * Formats a given number of bytes into a human-readable string using appropriate file size units.
 *
 * @param bytes - The number of bytes to format. If `undefined` or negative, returns an empty string.
 * @param fileSizeTypes - An optional array of file size unit labels, defaulting to
 *   ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'].
 * @param decimalPlaces - Optional number of decimal places to include. If not provided, defaults to:
 *   - 0 for KB or lower
 *   - 1 for MB or higher
 * @returns A formatted string representing the size in the most suitable unit, or an empty string if input is invalid.
 */
const formatSize = (
  bytes: number | undefined,
  fileSizeTypes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
  decimalPlaces?: number
) => {
  if (bytes === undefined || bytes < 0) {
    return ''
  }

  const k = 1024
  if (bytes === 0) {
    return `0 ${fileSizeTypes[0]}`
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  // Determine decimal places: use provided value or default based on unit
  const effectiveDecimalPlaces = decimalPlaces !== undefined ? decimalPlaces : i >= 2 ? 1 : 0
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(effectiveDecimalPlaces))

  return `${formattedSize} ${fileSizeTypes[i]}`
}

export { formatSize }
