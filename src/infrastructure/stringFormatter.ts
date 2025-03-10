/**
 * Capitalizes the first character of the given string.
 *
 * @param str - The string to be formatted.
 * @returns The formatted string with the first character capitalized.
 */
export function capitalizeFirstCharacter(str: string | undefined): string {
  if (str == undefined) {
    return ''
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}
