import { HttpMethod } from './HttpMethod'
import { sleepAsync } from '../infrastructure/asyncUtils'
import { ApiFetchError } from '../models/ApiFetchError'
import { type NotificationStore } from '../stores/NotificationStore'
import { useNotificationStore } from '../stores/useNotificationStore'
import { Guid } from '../models/Guid'
import { NotificationSeverity } from '../models/NotificationSeverity'

const MAX_NUMBER_RETRIES = 3
const RETRY_DELAY_MS = 250

/**
 * Message shown for failures that carry no usable detail of their own -- anything other than
 * a 400, 401 or 403. Exported so callers that supply their own wording can still fall back to
 * or build on the standard text.
 */
export const DEFAULT_NETWORK_ERROR_MESSAGE =
  'Sorry, there was temporary problem connecting over the network. ' +
  'Please verify you are connected to the internet and try again.'

/**
 * Supplies the headers to send on a single fetch attempt. Invoked immediately before
 * every attempt -- including the first -- so a retry sends freshly-read credentials
 * rather than replaying the ones captured when the request was first built.
 *
 * @param attemptNumber - Zero-based attempt index; 0 is the initial attempt.
 * @returns Headers to merge over the request's existing headers.
 */
export type RequestHeadersProvider = (
  attemptNumber: number
) => Record<string, string> | Promise<Record<string, string>>

/**
 * Produces the message shown for a failure that carries no detail of its own. Given as a
 * function rather than a string when deciding the wording needs work -- probing what is
 * actually reachable, say -- that should happen only once a request has already failed,
 * and only for the callers that ask for it.
 *
 * @returns The message to show. Invoked only in the fallback branch, never for 400/401/403.
 */
export type NetworkErrorMessageProvider = () => string | Promise<string>

/**
 * Cross-cutting options for an API call.
 *
 * Collected into one object deliberately: these concerns have to travel from the service
 * layer down to `fetch`, and as positional parameters every new one meant widening every
 * function in between and writing `undefined, undefined, value` at the call sites. Adding a
 * concern -- an idempotency key, a telemetry hook, a different backoff -- is now a field
 * here, and the layers that do not care about it simply pass the object along.
 */
export interface ApiRequestOptions {
  /** Standard fetch options: method, body, signal, headers. */
  init?: RequestInit
  /**
   * Supplies headers per attempt so a retry sends freshly-read credentials rather than
   * replaying the ones captured when the request was first built.
   */
  headersProvider?: RequestHeadersProvider
  /**
   * Replaces DEFAULT_NETWORK_ERROR_MESSAGE for failures other than 400, 401 and 403 --
   * the cases that carry no detail of their own. Lets a caller say what the user actually
   * lost instead of the generic wording. A function is awaited, so the wording can be
   * decided after the failure; it delays the notification, so keep it quick.
   */
  networkErrorMessage?: string | NetworkErrorMessageProvider
  /**
   * Failure statuses the caller handles itself, so no notification is shown for them -- a 404
   * for a resource that may have been removed, say. The call still fails as usual (null data,
   * the error set), so the caller can tell the user in place.
   */
  expectedStatusCodes?: ReadonlyArray<number>
  /** Status codes to retry. Defaults to [500, 503]. */
  retryStatusCodes?: Array<number>
}

/**
 * Normalizes any of the HeadersInit shapes into a plain record so headers can be merged.
 *
 * @param headers - The headers to normalize.
 * @returns The headers as a plain object.
 */
function toHeaderRecord(headers?: HeadersInit): Record<string, string> {
  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries())
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers)
  }
  return { ...((headers as Record<string, string> | undefined) ?? {}) }
}

/**
 * Performs a fetch operation with retries for specified status codes.
 * If the fetch operation fails, it will retry up to MAX_NUMBER_RETRIES times
 * with an exponential backoff delay.
 *
 * @param url - The URL to fetch.
 * @param [init] - The options for the fetch operation.
 * @param options - Retry and credential policy. `retryStatusCodes` defaults to [500, 503];
 *   503 (Service Unavailable) is transient by definition — a temporarily overloaded or
 *   redeploying service — so it is retried like a 500. `headersProvider`, when given, is
 *   read per attempt; without it every attempt replays the headers baked into `init`, so a
 *   request that failed because a credential rotated fails identically on every retry.
 * @returns The response from the fetch operation.
 */
export async function usingRetryForFetchAsync(
  url: string,
  init?: RequestInit,
  options?: Pick<ApiRequestOptions, 'headersProvider' | 'retryStatusCodes'>
) {
  const { headersProvider, retryStatusCodes = [500, 503] } = options ?? {}
  let retryNumber = 0
  let attemptNumber = 0
  let response: Response = new Response(null, {
    status: 418,
    statusText: 'Default response value'
  })

  while (retryNumber <= MAX_NUMBER_RETRIES) {
    try {
      // Re-read the headers for every attempt rather than reusing the ones captured when
      // the request was built: credentials can rotate mid-flight (a refresh on a timer, or
      // another tab), and replaying a stale one would fail every attempt the same way.
      const attemptInit = headersProvider
        ? {
            ...init,
            headers: {
              ...toHeaderRecord(init?.headers),
              ...(await headersProvider(attemptNumber++))
            }
          }
        : init

      response = await fetch(url, attemptInit)

      if (response.ok || response.status === 400 || response.status === 401) {
        return response
      }

      if (!retryStatusCodes.includes(response.status)) {
        return response
      }

      throw new Error(
        `Failed to fetch. Status: ${response?.status}, StatusText: ${response?.statusText}`
      )
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw err
      }
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
    console.error(error, baseUrl)
    throw new Error(`Invalid URL: ${baseUrl}`)
  }
}

/**
 * Gets the user's timezone and puts into an object suitable for using as an HTTP header.
 *
 * @returns An object with the name 'X-TimeZone' and the current Intl timeZone.
 */
export function getTimeZoneHeader() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const result = { 'X-TimeZone': timeZone }
  return result
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
    ...getTimeZoneHeader()
  } as any

  if (method === HttpMethod.Post && data && !init?.body) {
    defaultHeaders['Content-Type'] = 'application/json'
  }

  // Merge defaultHeaders and the caller's headers
  const mergedHeaders = { ...defaultHeaders, ...toHeaderRecord(init?.headers) }

  // Create the final RequestInit object
  const requestInit: RequestInit = {
    method,
    ...init,
    headers: mergedHeaders // Pass the merged headers as an object
  }

  // Only add the body for POST requests if data is provided AND init.body doesn't exist
  if (method === HttpMethod.Post && data && !init?.body) {
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
 * @param {ApiRequestOptions} [options] - Fetch options plus retry and credential policy.
 * @returns {Promise<T | null>} - A promise that resolves to the response data of type T or null if the response body is empty.
 * @throws {ApiFetchError} - Throws an error if the response is not ok.
 */
export async function apiFetchAsync<T = unknown>(
  baseUrl: string,
  argsOrData?: Record<string, unknown>,
  options?: ApiRequestOptions
): Promise<T | null> {
  const { init, headersProvider, retryStatusCodes } = options ?? {}

  // Generate the request based on the HTTP method
  const { url, options: requestInit } =
    (init?.method || HttpMethod.Get) === HttpMethod.Get
      ? createGetRequest(
          baseUrl,
          argsOrData as Record<string, string | number | null | undefined>,
          init
        )
      : createPostRequest(baseUrl, argsOrData || {}, init)

  const response = await usingRetryForFetchAsync(url, requestInit, {
    headersProvider,
    retryStatusCodes
  })

  if (!response?.ok) {
    throw new ApiFetchError(response)
  }

  // TODO: what if the response is ok but the body is empty?
  // Will this statement throw? If so
  const result = safeJsonAsync<T>(response)
  return result
}

/**
 * Executes an API fetch function with error handling.
 *
 * @deprecated Prefer `apiFetchWithErrorHandling`, which does the same thing without the
 *   injected fetch function and accepts `ApiRequestOptions`. Retained because this is a
 *   published entry point of this package and may have callers outside this repo.
 *
 * @template T - The type of the data expected from the API fetch function.
 * @param apiFetchFn - The API fetch function to be executed. It should return a promise that resolves to the expected data or null.
 * @param baseUrl - The base URL for the API request.
 * @param argsOrData - Optional arguments or data to be sent with the API request.
 * @param init - Optional request initialization options.
 * @param networkErrorMessage - Replaces DEFAULT_NETWORK_ERROR_MESSAGE for failures other than
 *   400, 401 and 403, letting a caller say what the user actually lost ("Your message was not
 *   sent...") instead of the generic wording. Does not affect the 400 path, which surfaces the
 *   server's own message, nor 401, which shows nothing because sign-out handles it.
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
export async function withErrorHandlingAsync<T = unknown>(
  apiFetchFn: (
    baseUrl: string,
    argsOrData?: Record<string, unknown>,
    init?: RequestInit
  ) => Promise<T | null>,
  baseUrl: string,
  argsOrData?: Record<string, unknown>,
  init?: RequestInit,
  networkErrorMessage?: string | NetworkErrorMessageProvider
): Promise<{ data: T | null; error: ApiFetchError | null }> {
  try {
    // Call the provided apiFetch function
    const data = await apiFetchFn(baseUrl, argsOrData, init)
    return { data, error: null } // Return the result with no error
  } catch (error) {
    return await toErrorResultAsync<T>(error, networkErrorMessage)
  }
}

/**
 * Resolves the caller's fallback wording, awaiting a provider if one was given.
 *
 * A provider that throws must not cost the user their notification, so any failure there
 * falls back to the standard message.
 *
 * @param networkErrorMessage - The caller's message or provider, if any.
 * @returns The message to display.
 */
async function resolveNetworkErrorMessageAsync(
  networkErrorMessage?: string | NetworkErrorMessageProvider
): Promise<string> {
  if (typeof networkErrorMessage !== 'function') {
    return networkErrorMessage ?? DEFAULT_NETWORK_ERROR_MESSAGE
  }
  try {
    return (await networkErrorMessage()) || DEFAULT_NETWORK_ERROR_MESSAGE
  } catch (error) {
    console.warn('Network error message provider failed; using the default message.', error)
    return DEFAULT_NETWORK_ERROR_MESSAGE
  }
}

/**
 * Turns a thrown error into the { data, error } result shape, notifying the user when the
 * failure is one they can act on.
 *
 * @template T - The type the caller expected; only ever returned as null here.
 * @param error - The thrown error.
 * @param networkErrorMessage - Replaces DEFAULT_NETWORK_ERROR_MESSAGE for failures other
 *   than 400, 401 and 403.
 * @param expectedStatusCodes - Failure statuses the caller handles itself, so they are not
 *   notified.
 * @returns The result to hand back to the caller.
 */
async function toErrorResultAsync<T = unknown>(
  error: unknown,
  networkErrorMessage?: string | NetworkErrorMessageProvider,
  expectedStatusCodes?: ReadonlyArray<number>
): Promise<{ data: T | null; error: ApiFetchError | null }> {
  if (error instanceof ApiFetchError) {
    if (expectedStatusCodes?.includes(error.response.status)) {
      return { data: null, error }
    }

    const notificationStore = useNotificationStore() as NotificationStore

    let displayMessage: string
    let severity: NotificationSeverity

    if (error.response.status === 400) {
      // For 400 errors, try to extract the actual error message from the response
      try {
        // Check if the response body is still readable
        if (error.response.bodyUsed) {
          // If body was already consumed, use status text
          displayMessage = error.response.statusText || 'Invalid request'
        } else {
          // Clone the response to avoid consuming the body stream
          const responseClone = error.response.clone()
          const body = await responseClone.json()

          // Try to extract error message from common response formats
          displayMessage =
            body.message ||
            body.error ||
            body.detail ||
            body.title ||
            body.description ||
            body.errorMessage ||
            body.Message || // Try capitalized versions (for .NET Framework)
            body.Error ||
            body.Detail ||
            error.response.statusText ||
            'We could not process your request. Please try again.'
        }
      } catch {
        // If JSON parsing fails then display a generic message
        displayMessage = 'We could not process your request. Please try again.'
      }

      severity = NotificationSeverity.Warning
    } else if (error.response.status === 401) {
      // For 401 errors, don't show a notification - the authentication store will handle sign-out
      // This prevents duplicate messages when the user is being signed out
      return { data: null, error }
    } else if (error.response.status === 403) {
      displayMessage = 'This action could not be completed. Please refresh and try again.'
      severity = NotificationSeverity.Warning
    } else {
      // For other errors there is no detail worth surfacing, so use the caller's wording
      // when it gave any and the generic network message otherwise.
      displayMessage = await resolveNetworkErrorMessageAsync(networkErrorMessage)
      severity = NotificationSeverity.Error
    }

    notificationStore.addMessage({
      id: Guid.newGuid(),
      text: displayMessage,
      severity: severity
    })

    // Handle known ApiFetchError
    return { data: null, error }
  } else if (error instanceof DOMException && error.name === 'AbortError') {
    return { data: null, error: null }
  } else {
    // Handle unexpected errors
    console.error('Unexpected error occurred:', error)
    return {
      data: null,
      error: new ApiFetchError(new Response(null, { status: 500, statusText: 'Unknown Error' }))
    }
  }
}

/**
 * Fetches data from an API endpoint with error handling.
 *
 * @template T - The type of the data expected from the API response.
 * @param {string} baseUrl - The base URL of the API endpoint.
 * @param {Record<string, unknown>} [argsOrData] - Optional arguments or data to be sent with the request.
 * @param {ApiRequestOptions} [options] - Fetch options plus retry, credential and messaging policy.
 * @returns {Promise<{ data: T | null; error: ApiFetchError | null }>} A promise that resolves to an object containing either the fetched data or an error.
 */
export async function apiFetchWithErrorHandling<T = unknown>(
  baseUrl: string,
  argsOrData?: Record<string, unknown>,
  options?: ApiRequestOptions
): Promise<{
  data: T | null
  error: ApiFetchError | null
}> {
  try {
    const data = await apiFetchAsync<T>(baseUrl, argsOrData, options)
    return { data, error: null }
  } catch (error) {
    return await toErrorResultAsync<T>(
      error,
      options?.networkErrorMessage,
      options?.expectedStatusCodes
    )
  }
}

/**
 * Safely parses a JSON response.
 *
 * @template T - The expected type of the parsed JSON.
 * @param {Response} response - The response object to parse.
 * @returns {Promise<T | null>} A promise that resolves to the parsed JSON object of type T, or null if parsing fails.
 */
export async function safeJsonAsync<T>(response: Response): Promise<T | null> {
  try {
    const result = await response.json()
    return result
  } catch {
    console.warn('Could not parse json...returning null.')
    // Return null if JSON parsing fails
    return null
  }
}
