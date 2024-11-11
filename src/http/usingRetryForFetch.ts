import { sleepAsync } from '../infrastructure'

const MAX_NUMBER_RETRIES = 3
const RETRY_DELAY_MS = 250

/**
 * Performs a fetch operation with retries for specified status codes.
 * If the fetch operation fails, it will retry up to MAX_NUMBER_RETRIES times
 * with an exponential backoff delay.
 *
 * @param url - The URL to fetch.
 * @param [init] - The options for the fetch operation.
 * @param retryStatusCodes - Status codes for which to retry (default: 500-599).
 * @returns The response from the fetch operation.
 */
export async function usingRetryForFetch(
  url: string,
  init?: RequestInit,
  retryStatusCodes: number[] = [500]
) {
  let retryNumber = 0
  let response: Response = new Response(null, {
    status: 418,
    statusText: 'Default response value'
  })

  while (retryNumber < MAX_NUMBER_RETRIES) {
    try {
      response = await fetch(url, init)

      // Return if successful or on specific client errors
      if (response.ok || response.status === 400 || response.status === 401) {
        return response
      }

      // Retry only for specified status codes
      if (!retryStatusCodes.includes(response.status)) {
        return response
      }

      throw new Error(
        `Failed to fetch. Status: ${response.status}, StatusText: ${response.statusText}`
      )
    } catch (err) {
      retryNumber++
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.warn(`Retry ${retryNumber}/${MAX_NUMBER_RETRIES} for ${url} failed: ${errorMessage}`)

      if (retryNumber >= MAX_NUMBER_RETRIES) break

      // Exponential backoff
      await sleepAsync(RETRY_DELAY_MS * 2 ** (retryNumber - 1))
    }
  }

  console.error(
    `Failed to fetch ${url} after ${MAX_NUMBER_RETRIES} retries. Status: ${response.status}, StatusText: ${response.statusText}`
  )
  return response
}
