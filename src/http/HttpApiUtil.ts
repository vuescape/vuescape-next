import { HttpMethod } from './HttpMethod'
import { sleepAsync } from '../infrastructure/asyncUtils'
import { ApiFetchError } from '../models/ApiFetchError'
import { type NotificationStore } from '../stores/NotificationStore'
import { useNotificationStore } from '../stores/useNotificationStore'
import { Guid } from '../models/Guid'
import { NotificationSeverity } from '../models/NotificationSeverity'
import { type NotificationMessage } from '../models/NotificationMessage'

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

  while (retryNumber <= MAX_NUMBER_RETRIES) {
    try {
      response = await fetch(url, init)

      if (response.ok || response.status === 400 || response.status === 401) {
        // console.log('Successful fetch or client error')
        return response
      }

      if (!retryStatusCodes.includes(response.status)) {
        // console.log('Status not in retryStatusCodes, returning response')
        return response
      }

      throw new Error(
        `Failed to fetch. Status: ${response?.status}, StatusText: ${response?.statusText}`
      )
    } catch (err) {
      retryNumber++
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.warn(`Retry ${retryNumber}/${MAX_NUMBER_RETRIES} for ${url} failed: ${errorMessage}`)

      if (retryNumber >= MAX_NUMBER_RETRIES) {
        // console.log('Max retries reached, exiting loop')
        break
      }

      await sleepAsync(RETRY_DELAY_MS * 2 ** (retryNumber - 1))
    }
  }

  console.error(
    `Failed to fetch ${url} after ${MAX_NUMBER_RETRIES} retries. Status: ${response?.status}, StatusText: ${response?.statusText}`
  )
  return response
}

/**
 * Constructs a URL by appending query parameters to the base URL.
 *
 * @param baseUrl - The base URL to which query parameters will be appended.
 * @param args - An optional object containing key-value pairs to be used as query parameters.
 *               The values can be of type string, number, null, or undefined.
 *               Keys with undefined or null values will be ignored.
 * @returns The constructed URL as a string.
 * @throws Will throw an error if the base URL is invalid.
 */
export function constructUrl(
  baseUrl: string,
  args?: Record<string, string | number | null | undefined>
): string {
  try {
    const url = new URL(baseUrl) // Validate the URL
    if (args && typeof args === 'object') {
      Object.keys(args).forEach((key) => {
        const value = args[key]
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value)) // Convert value to string
        }
      })
    }
    return url.toString()
  } catch (error) {
    console.error(error)
    throw new Error(`Invalid URL: ${baseUrl}`)
  }
}

/**
 * Prepares a RequestInit object for an HTTP request.
 *
 * @param method - The HTTP method to use for the request (e.g., GET, POST).
 * @param url - The URL to which the request is sent.
 * @param data - Optional data to be sent with the request, typically used with POST requests.
 * @param init - Optional additional RequestInit properties to be merged with the defaults.
 * @returns A RequestInit object configured with the specified method, headers, and body.
 */
export function prepareRequest(
  method: HttpMethod,
  url: string,
  data?: Record<string, unknown>,
  init?: RequestInit
): RequestInit {
  const origin = window?.location?.origin
  const defaultHeaders = {
    'Access-Control-Allow-Origin': origin,
    Origin: origin,
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  }

  // Convert init.headers to an object if it's a Headers instance
  const initHeaders =
    init?.headers instanceof Headers
      ? Object.fromEntries(init.headers.entries()) // Convert Headers to a plain object
      : init?.headers || {}

  // Merge defaultHeaders and initHeaders
  const mergedHeaders = { ...defaultHeaders, ...initHeaders }

  // Create the final RequestInit object
  const requestInit: RequestInit = {
    method,
    ...init,
    headers: mergedHeaders // Pass the merged headers as an object
  }

  if (method === HttpMethod.Post) {
    requestInit.headers = {
      ...requestInit.headers
    }
    requestInit.body = JSON.stringify(data || {})
  }

  return requestInit
}

/**
 * Creates a request object with the specified parameters.
 *
 * @param baseUrl - The base URL for the request.
 * @param method - The HTTP method to use for the request.
 * @param argsOrData - Optional arguments or data to include in the request. For GET requests, this should be a record of query parameters. For POST requests, this should be the request body.
 * @param init - Optional additional request initialization options.
 * @returns An object containing the constructed URL and the request options.
 */
function createRequest(
  baseUrl: string,
  method: HttpMethod,
  argsOrData?: Record<string, unknown>,
  init?: RequestInit
): { url: string; options: RequestInit } {
  const url =
    method === HttpMethod.Get
      ? constructUrl(baseUrl, argsOrData as Record<string, string | number | null | undefined>)
      : baseUrl

  const options = prepareRequest(
    method,
    url,
    method === HttpMethod.Post ? argsOrData : undefined,
    init
  )

  return { url, options }
}

/**
 * Creates a GET request configuration.
 *
 * @param baseUrl - The base URL for the request.
 * @param args - An optional object containing query parameters as key-value pairs.
 * @param init - Optional additional request options.
 * @returns An object containing the full URL with query parameters and the request options.
 */
export function createGetRequest(
  baseUrl: string,
  args?: Record<string, string | number | null | undefined>,
  init?: RequestInit
): { url: string; options: RequestInit } {
  return createRequest(baseUrl, HttpMethod.Get, args, init)
}

/**
 * Creates a POST request configuration.
 *
 * @param baseUrl - The base URL for the request.
 * @param data - The data to be sent in the body of the request.
 * @param init - Optional additional request options.
 * @returns An object containing the URL and request options.
 */
export function createPostRequest(
  baseUrl: string,
  data: Record<string, unknown>,
  init?: RequestInit
): { url: string; options: RequestInit } {
  return createRequest(baseUrl, HttpMethod.Post, data, init)
}

/**
 * Makes an API fetch request using the specified HTTP method and returns the response data.
 *
 * @template T - The expected response type.
 * @param {string} baseUrl - The base URL for the API request.
 * @param {Record<string, unknown>} [argsOrData] - The query parameters for GET requests or the body data for POST requests.
 * @param {RequestInit} [init] - Additional request options, including the HTTP method.
 * @returns {Promise<T | null>} - A promise that resolves to the response data of type T or null if the response body is empty.
 * @throws {ApiFetchError} - Throws an error if the response is not ok.
 */
export async function apiFetch<T = unknown>(
  baseUrl: string,
  argsOrData?: Record<string, unknown>,
  init?: RequestInit
): Promise<T | null> {
  // Generate the request based on the HTTP method
  const { url, options } =
    (init?.method || HttpMethod.Get) === HttpMethod.Get
      ? createGetRequest(
          baseUrl,
          argsOrData as Record<string, string | number | null | undefined>,
          init
        )
      : createPostRequest(baseUrl, argsOrData || {}, init)

  const response = await usingRetryForFetch(url, options)

  if (!response?.ok) {
    throw new ApiFetchError(response)
  }

  // TODO: what if the response is ok but the body is empty?
  // Will this statement throw? If so
  const result = safeJson<T>(response)
  return result
}

/**
 * Executes an API fetch function with error handling.
 *
 * @template T - The type of the data expected from the API fetch function.
 * @param apiFetchFn - The API fetch function to be executed. It should return a promise that resolves to the expected data or null.
 * @param baseUrl - The base URL for the API request.
 * @param argsOrData - Optional arguments or data to be sent with the API request.
 * @param init - Optional request initialization options.
 * @returns A promise that resolves to an object containing either the fetched data or an error.
 *
 * @example
 * ```typescript
 * const result = await withErrorHandling(fetchData, 'https://api.example.com/data');
 * if (result.error) {
 *   console.error('API fetch error:', result.error);
 * } else {
 *   console.log('Fetched data:', result.data);
 * }
 * ```
 */
export async function withErrorHandling<T = unknown>(
  apiFetchFn: (
    baseUrl: string,
    argsOrData?: Record<string, unknown>,
    init?: RequestInit
  ) => Promise<T | null>,
  baseUrl: string,
  argsOrData?: Record<string, unknown>,
  init?: RequestInit
): Promise<{ data: T | null; error: ApiFetchError | null }> {
  try {
    // Call the provided apiFetch function
    const data = await apiFetchFn(baseUrl, argsOrData, init)
    return { data, error: null } // Return the result with no error
  } catch (error) {
    if (error instanceof ApiFetchError) {
      const notificationStore = useNotificationStore() as NotificationStore
      const messages = notificationStore.messages as Array<NotificationMessage>
      messages.push({
        id: Guid.newGuid(),
        text:
          'Sorry, there was temporary problem connecting over the network. ' +
          'Please verify you are connected to the internet and try again.',
        severity: NotificationSeverity.Error
      })
      // Handle known ApiFetchError
      return { data: null, error }
    } else {
      // Handle unexpected errors
      console.error('Unexpected error occurred:', error)
      return {
        data: null,
        error: new ApiFetchError(new Response(null, { status: 500, statusText: 'Unknown Error' }))
      }
    }
  }
}

/**
 * Fetches data from an API endpoint with error handling.
 *
 * @template T - The type of the data expected from the API response.
 * @param {string} baseUrl - The base URL of the API endpoint.
 * @param {Record<string, unknown>} [argsOrData] - Optional arguments or data to be sent with the request.
 * @param {RequestInit} [init] - Optional custom settings to apply to the request.
 * @returns {Promise<{ data: T | null; error: ApiFetchError | null }>} A promise that resolves to an object containing either the fetched data or an error.
 */
export function apiFetchWithErrorHandling<T = unknown>(
  baseUrl: string,
  argsOrData?: Record<string, unknown>,
  init?: RequestInit
): Promise<{
  data: T | null
  error: ApiFetchError | null
}> {
  const result = withErrorHandling(apiFetch<T>, baseUrl, argsOrData, init)
  return result
}

/**
 * Safely parses a JSON response.
 *
 * @template T - The expected type of the parsed JSON.
 * @param {Response} response - The response object to parse.
 * @returns {Promise<T | null>} A promise that resolves to the parsed JSON object of type T, or null if parsing fails.
 */
export async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    return await response.json()
  } catch {
    return null // Return null if JSON parsing fails
  }
}
