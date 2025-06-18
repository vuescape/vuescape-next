/**
 * Generates a fast, non-cryptographic hash string for a given object.
 *
 * The function serializes the input object to JSON, computes a 32-bit hash using a DJB2-like algorithm,
 * and encodes the result as a base64 string.
 *
 * @param obj - The object to hash. Can be of any type.
 * @returns A base64-encoded string representing the hash of the input object.
 */
export function fastHash(obj: unknown): string {
  // Handle null and undefined as a special case
  if (obj == null) {
    return btoa('null')
  }
  return btoa(
    JSON.stringify(obj)
      .split('')
      .reduce((h, c) => (h << 5) - h + c.charCodeAt(0), 0) // 32-bit DJB2
      .toString()
  )
}
