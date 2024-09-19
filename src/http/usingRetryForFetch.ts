import { sleepAsync } from '../infrastructure'

/**
 * Maximum number of retries for the fetch operation.
 */
const MAX_NUMBER_RETRIES = 3

/**
 * Delay between retries in milliseconds.
 */
const RETRY_DELAY_MS = 250

/**
 * Performs a fetch operation with retries.
 * If the fetch operation fails, it will be retried up to MAX_NUMBER_RETRIES times.
 * A delay of RETRY_DELAY_MS milliseconds is added between each retry.
 * If all retries fail, it logs an error and returns the last received response.
 *
 * @param url - The URL to fetch.
 * @param [init] - The options for the fetch operation.
 * @returns The response from the fetch operation.
 */
export async function usingRetryForFetch(url: string, init?: RequestInit) {
  let retryNumber = 0
  let response: Response = new Response(null, {
    status: 418,
    statusText: 'Default response value',
  })

  while (retryNumber <= MAX_NUMBER_RETRIES) {
    try {
      response = await fetch(url, init)
      if (response.ok || response.status === 400 || response.status === 401) {
        return response
      }
      // noinspection ExceptionCaughtLocallyJS - We want to retry on any other error
      throw new Error(`Failed to fetch. Status: ${response.status}, StatusText: ${response.statusText}`)
    } catch (err) {
      retryNumber++
      await sleepAsync(RETRY_DELAY_MS)
    }
  }

  console.error(`Failed to fetch ${url} after ${MAX_NUMBER_RETRIES} retries. Status: ${response.status}, StatusText: ${response.statusText}`)
  return response
}
