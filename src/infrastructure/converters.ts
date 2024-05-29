/**
 * Tries to convert a string to an enum value.
 * If the string is undefined, it returns undefined.
 * Otherwise, it calls the `toEnum` function to perform the conversion.
 *
 * @param enumType - The enum type.
 * @param enumString - The string to convert.
 * @param [shouldCapitalizeFirstCharacter=true] - Whether to capitalize the first character of the string.
 * @returns The enum value, or undefined if the string is undefined.
 */
export function tryToEnum<T>(enumType: T,
  enumString: string | undefined,
  shouldCapitalizeFirstCharacter = true,
): T[keyof T] | undefined {
  if (enumString == null) {
    return
  }

  return toEnum(enumType, enumString, shouldCapitalizeFirstCharacter)
}

/**
 * Converts a string to an enum value.
 * It splits the string by the '|' character to handle flags.
 * It then iterates over the split strings and adds the corresponding enum values to the result.
 * If the result is still null after the iteration, it throws an error.
 *
 * @param enumType - The enum type.
 * @param enumString - The string to convert.
 * @param [shouldCapitalizeFirstCharacter=true] - Whether to capitalize the first character of the string.
 * @returns The enum value.
 * @throws If the string does not correspond to any enum value.
 */
export function toEnum<T>(enumType: T, enumString: string, shouldCapitalizeFirstCharacter = true): T[keyof T] {
  // Split to handle flags
  const enumStrings = enumString
    .split('|')
    .map(_ => (shouldCapitalizeFirstCharacter ? _.replace(/^\w/, c => c.toUpperCase()) : _))

  let result: T[keyof T] | undefined
  for (const enumStringKey of enumStrings) {
    const enumKey = enumStringKey as keyof T
    const enumValue = enumType[enumKey]

    if (result == null) {
      result = enumValue
    }
    else {
      // Add value if flags
      // tslint:disable-next-line: no-bitwise
      (result as any) |= enumValue as any
    }
  }

  // Must have a result now unless we couldn't find the enum. Don't have the enum name here
  // so just list out the values (should be able to determine the enum from those in the case of troubleshooting).
  if (result == null) {
    throw new Error(`The enum string, '${enumString}', was not found in the enum with values of: '${Object.values(
      enumType as object).filter(v => isNaN(Number(v)))}'.`)
  }

  return result
}

/**
 * Decodes a base64 string to a Uint8Array.
 *
 * @param base64String - The base64 string to decode.
 * @returns The decoded Uint8Array.
 */
export function decodeBase64String(base64String: string) {
  const byteCharacters = atob(base64String)
  const byteNumbers    = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const result = new Uint8Array(byteNumbers)
  return result
}
