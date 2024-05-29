import { PresentationFormatKind } from './PresentationFormatKind'

export const DEFAULT_EMPTY_DISPLAY = '-'

/**
 * Validates data and converts it into a number, then calls formatResult with the number to get the formatted result.
 * @param value - The value to attempt to convert into a number.
 * @param formatResult - The function that will format the result for valid numbers.
 * @param emptyDisplay - The value to return if the input value is empty.
 * @returns The formatted result value from formatResult or an empty result.
 */
const formatWithNumber = (value: string, formatResult: (value: number) => string, emptyDisplay: string): string => {
  if (value == null || value === '') {
    return emptyDisplay
  }

  const numberValue = Number(value)

  return isFinite(numberValue) ? formatResult(numberValue) : emptyDisplay
}

/**
 * Converts a value to a formatted number with optional decimal places.
 *
 * @param value - The value to be converted to a number.
 * @param places - The number of decimal places to display (optional).
 *
 * @returns The formatted number as a string.
 */
const toNumber = (value: any, places: number) => {
  let p = places || 0
  p     = p < 0 ? 0 : p

  const factor  = Math.pow(10, p)
  const rounded = Math.round(Math.abs(value * factor)) / factor
  const parts   = (rounded + '').split('.')

  let result = parts[0]
    .split('')
    .reverse()
    .reduce((acc, num, i) => {
      return num + (i && !(i % 3) ? ',' : '') + acc
    }, '')

  if (p > 0) {
    let digitsAfterDecimal = parts.length > 1 && parseInt(parts[1], undefined) ? parts[1] : ('' + factor).substring(1)
    digitsAfterDecimal     = digitsAfterDecimal + ('' + factor).substring(1 + digitsAfterDecimal.length)
    result += '.' + digitsAfterDecimal
  }

  return result
}

/**
 * Formats a value for accounting display.
 *
 * @param value - The value to format.
 * @param places - The number of decimal places to round the value to. Default is 1.
 * @param emptyDisplay - The display value to use when the input value is empty.
 * @returns The formatted value for accounting display.
 */
const toAccountingDisplay = (value: string, places: number, emptyDisplay: string) => {
  const p         = places || 1
  const formatter = (numberValue: number) => round(numberValue, p) >= 0.0 ? toNumber(numberValue, p) :
    '(' + toNumber(numberValue, p) + ')'
  return formatWithNumber(value, formatter, emptyDisplay)
}

/**
 * Formats a currency value to display with the specified number of decimal places.
 * If the value is not a number or if it is NaN, the empty display value will be returned.
 *
 * @param value - The currency value to format.
 * @param places - The number of decimal places to include in the display.
 * @param emptyDisplay - The value to display if the currency value is not valid or NaN.
 * @returns The formatted currency value, or the empty display value if the currency value is not valid.
 */
const toCurrencyDisplay = (value: string, places: number, emptyDisplay: string) => {
  const formatter = (numberValue: number) => round(numberValue, places) >= 0.0 ? '$' + toNumber(numberValue, places) :
    '-$' + toNumber(numberValue, places)

  return formatWithNumber(value, formatter, emptyDisplay)
}

/**
 * Formats a number value as a currency display with millimeter (mm) units.
 *
 * @param value - The number value to format as a currency display.
 * @param places - The number of decimal places to round the value to (default is 1).
 * @param emptyDisplay - The display value to return if the input value is empty.
 *
 * @returns The formatted currency display string in the format of '$valuemm' or '-$valuemm'.
 */
const toMMCurrencyDisplay = (value: string, places: number, emptyDisplay: string) => {
  const formatter = (numberValue: number) => {
    const p = places || 1
    return round(numberValue, p) >= 0.0 ? '$' + toNumber(numberValue, p) + 'mm' : '-$' + toNumber(numberValue, p) + 'mm'
  }

  return formatWithNumber(value, formatter, emptyDisplay)
}

/**
 * Displays a value as a percentage string with a specified number of decimal places.
 *
 * @param value - The value to be displayed as a percentage. Must be a valid numeric string.
 * @param places - The number of decimal places to display in the percentage.
 * @param emptyDisplay - The string to be displayed when the value is empty or not a valid numeric string.
 * @returns The value formatted as a percentage string.
 */
const toPercentageDisplay = (value: string, places: number, emptyDisplay: string) => {
  const formatter = (numberValue: number) => {
    return round(numberValue, places) >= 0.0 ? toNumber(numberValue, places) + '%' :
      '-' + toNumber(numberValue, places) + '%'
  }

  return formatWithNumber(value, formatter, emptyDisplay)
}

/**
 * Formats a string value into a number display with the specified number of places and an empty display.
 *
 * @param value - The string value to be formatted.
 * @param places - The number of decimal places to display.
 * @param emptyDisplay - The display to use for an empty value.
 * @returns The formatted number display.
 */
const toNumberDisplay = (value: string, places: number, emptyDisplay: string) => {
  const formatter = (numberValue: number) => round(numberValue, places) >= 0.0 ? toNumber(numberValue, places) :
    '-' + toNumber(numberValue, places)

  return formatWithNumber(value, formatter, emptyDisplay)
}

/**
 * Converts a given value to a formatted date string.
 *
 * @param value - The value to be converted to a date.
 * @param [emptyValue='-'] - The default value to return if the input value is null or undefined.
 * @returns The formatted date string.
 */
export const toDateDisplay = (value: any, emptyValue = '-') => {
  if (value == null) {
    return emptyValue
  }

  let dateValue = new Date(value)
  // This is to fix a Safari problem in its handling of UTC dates
  if (isNaN(dateValue.getTime())) {
    dateValue = new Date(value + 'Z')
  }
  value = dateValue

  const result = isNaN(dateValue.getTime()) ? emptyValue :
    value.getMonth() + 1 + '/' + value.getDate() + '/' + value.getFullYear()

  return result
}

/**
 * Returns a formatted string representation of a date and time value.
 * If the value is null or undefined, it returns the emptyValue parameter.
 *
 * @param value - The date and time value to be formatted.
 * @param [emptyValue = '-'] - The value to be returned if the input value is null or undefined.
 * @returns The formatted string representation of the date and time value.
 */
export const toDateTimeDisplay = (value: any, emptyValue = '-') => {
  if (value == null) {
    return emptyValue
  }

  let dateValue = new Date(value)
  // This is to fix a Safari problem in its handling of UTC dates
  dateValue     = isNaN(dateValue.getTime()) ? new Date(dateValue + 'Z') : dateValue

  let hours   = dateValue.getHours()
  const amPm  = hours < 12 ? 'am' : 'pm'
  hours       = hours < 12 ? hours : hours - 12
  hours       = hours === 0 ? 12 : hours
  let minutes = '' + dateValue.getMinutes()
  minutes     = minutes.length === 1 ? '0' + minutes : minutes
  // let seconds = '' + value.getSeconds();
  // seconds = seconds.length === 1 ? '0' + seconds : seconds;

  return isNaN(dateValue.getTime()) ? emptyValue :
    dateValue.getMonth() + 1 + '/' + dateValue.getDate() + '/' + dateValue.getFullYear() + ' ' + hours + ':' + minutes + // +
    // ":"
    // +
    // seconds
    ' ' + amPm
}

/**
 * Converts a value to a text display.
 * If the value is a non-empty string, it is returned as is. Otherwise, returns the specified empty display value.
 *
 * @param value - The value to convert.
 * @param [emptyDisplay='-'] - The empty display value to return.
 * @returns The converted text display.
 */
export const toTextDisplay = (value: any, emptyDisplay = '-') => {
  if (typeof value === 'string' && value.length > 0) {
    return value
  }

  return emptyDisplay
}

type DisplayFunction = (value: any, places: number, emptyDisplay: string) => string;

export const presentationFormatMap: Record<string, DisplayFunction> = {
  currency  : toCurrencyDisplay,
  percentage: toPercentageDisplay,
  number    : toNumberDisplay,
  ratio     : toNumberDisplay,
  accounting: toAccountingDisplay,
  mmcurrency: toMMCurrencyDisplay,
}

/**
 * A map that maps PresentationFormatKind to their corresponding symbols.
 */
export const presentationFormatKindToSymbolMap = new Map<PresentationFormatKind, string>(
  [[PresentationFormatKind.Currency, '$'],
    [PresentationFormatKind.Percentage, '%'],
    [PresentationFormatKind.Number, '#'],
    [PresentationFormatKind.Ratio, '/'],
    [PresentationFormatKind.Accounting, '$'],
    [PresentationFormatKind.MMCurrency, '$']])

/**
 * Rounds a given number to the specified number of decimal places.
 *
 * @param value - The number to be rounded.
 * @param [places=0] - The number of decimal places to round to. Defaults to 0.
 *
 * @returns The rounded number.
 */
export function round(value: number, places: number = 0) {
  let p = places || 0
  p     = p < 0 ? 0 : p

  const factor  = Math.pow(10, p)
  const rounded = (Math.sign(value) * Math.round(Math.abs(value * factor))) / factor

  return rounded
}

/**
 * Formats the given value according to the specified presentation format.
 *
 * @param presentationFormat - The presentation format to use.
 * @param value - The value to format.
 * @param numberOfDecimalPlaces - The number of decimal places to display.
 * @param [emptyDisplay=DEFAULT_EMPTY_DISPLAY] - The value to display when the input value is empty.
 * @returns The formatted value.
 */
export function formatValue(
  presentationFormat: PresentationFormatKind,
  value: string,
  numberOfDecimalPlaces: number,
  emptyDisplay = DEFAULT_EMPTY_DISPLAY,
) {
  const formatter = presentationFormatMap[presentationFormat]
  if (!formatter) {
    console.warn(`Could not find formatter for presentationFormat: ${presentationFormat}. Using original value of ${value}.`)
    return value
  }

  return formatter(value, numberOfDecimalPlaces, emptyDisplay)
}
