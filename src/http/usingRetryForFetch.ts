/**
 * Maximum number of retries for the fetch operation.
 */
const MAX_NUMBER_RETRIES = 3

/**
 * Delay between retries in milliseconds.
 */
const RETRY_DELAY_MS = 250


/**
 * Creates a promise that resolves after a specified delay.
 *
 * @param delay - The delay in milliseconds.
 * @returns A promise that resolves after the specified delay.
 */
const sleep = (delay: number) => new Promise(resolve => setTimeout(resolve, delay))

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
  let retryNumber        = 0
  let response: Response = new Response(undefined,
    {
      status: 418,
      statusText: 'Default response value',
    },
  )
  while (retryNumber <= MAX_NUMBER_RETRIES) {
    try {
      response = await fetch(url, init)
      if (response.ok || response.status === 400 || response.status === 401) {
        return response
      }
    }
    catch (err) {
      // Swallow error and retry
    }
    finally {
      retryNumber++
      await sleep(RETRY_DELAY_MS)
    }
  }

  console.error(`Max retries exceeded calling ${url}. Returning:`, response)
  return response
}
