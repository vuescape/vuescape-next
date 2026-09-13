import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpMethod } from '../HttpMethod'
import {
  DEFAULT_NETWORK_ERROR_MESSAGE,
  usingRetryForFetchAsync,
  constructUrl,
  prepareRequest,
  createGetRequest,
  createPostRequest,
  apiFetchAsync,
  withErrorHandlingAsync,
  apiFetchWithErrorHandling,
  safeJsonAsync
} from '../HttpApiUtil'
import { ApiFetchError } from '../../models/ApiFetchError'
import { useNotificationStore } from '../../stores/useNotificationStore'
import { createPinia, setActivePinia } from 'pinia'

setActivePinia(createPinia())

describe('HttpApiUtil', () => {
  const mockFetch = vi.fn()
  global.fetch = mockFetch

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('usingRetryForFetch', () => {
    it('retries the fetch operation on specified status codes', async () => {
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 500 }))
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 500 }))
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }))

      const response = await usingRetryForFetchAsync(
        'https://example.com',
        {},
        {
          retryStatusCodes: [500]
        }
      )
      expect(response.status).toBe(200)
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    it('returns response on client errors without retrying', async () => {
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 400 }))

      const response = await usingRetryForFetchAsync('https://example.com')
      expect(response.status).toBe(400)
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('retries 503 (Service Unavailable) responses by default', async () => {
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 503 }))
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }))

      const response = await usingRetryForFetchAsync('https://example.com')
      expect(response.status).toBe(200)
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    describe('headersProvider', () => {
      it('sends the headers the provider returns for the attempt, not the ones in init', async () => {
        // Arrange: a credential that rotates between the failing attempt and the next one.
        mockFetch.mockResolvedValueOnce(new Response(null, { status: 500 }))
        mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }))
        const tokens = ['stale-token', 'rotated-token']

        // Act
        await usingRetryForFetchAsync(
          'https://example.com',
          { headers: { authZ: 'stale-token', Accept: 'application/json' } },
          {
            retryStatusCodes: [500],
            headersProvider: (attemptNumber) => ({ authZ: tokens[attemptNumber] })
          }
        )

        // Assert: the retry carries the rotated token, and untouched headers survive.
        expect(mockFetch.mock.calls[0][1].headers).toEqual({
          authZ: 'stale-token',
          Accept: 'application/json'
        })
        expect(mockFetch.mock.calls[1][1].headers).toEqual({
          authZ: 'rotated-token',
          Accept: 'application/json'
        })
      })

      it('awaits an async provider', async () => {
        mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }))

        await usingRetryForFetchAsync(
          'https://example.com',
          {},
          {
            headersProvider: () => Promise.resolve({ authZ: 'resolved-token' })
          }
        )

        expect(mockFetch.mock.calls[0][1].headers).toEqual({ authZ: 'resolved-token' })
      })

      it('leaves init untouched when no provider is given', async () => {
        mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }))
        const init = { headers: { authZ: 'only-token' } }

        await usingRetryForFetchAsync('https://example.com', init)

        expect(mockFetch.mock.calls[0][1]).toBe(init)
      })
    })
  })

  describe('constructUrl', () => {
    it('constructs a URL with query parameters', () => {
      const url = constructUrl('https://example.com', { foo: 'bar', baz: 123 })
      expect(url).toBe('https://example.com/?foo=bar&baz=123')
    })

    it('throws an error for invalid base URL', () => {
      expect(() => constructUrl('invalid-url')).toThrow('Invalid URL: invalid-url')
    })
  })

  describe('prepareRequest', () => {
    it('prepares a GET request with default headers', () => {
      const request = prepareRequest(HttpMethod.Get, 'https://example.com')
      expect(request.method).toBe(HttpMethod.Get)
      expect(request.headers).toHaveProperty('Accept')
    })

    it('prepares a POST request with JSON body', () => {
      const data = { foo: 'bar' }
      const request = prepareRequest(HttpMethod.Post, 'https://example.com', data)
      expect(request.method).toBe(HttpMethod.Post)
      expect(request.headers).toHaveProperty('Content-Type', 'application/json')
      expect(request.body).toBe(JSON.stringify(data))
    })
  })

  describe('createGetRequest', () => {
    it('creates a GET request configuration', () => {
      const { url, options } = createGetRequest('https://example.com', { foo: 'bar' })
      expect(url).toBe('https://example.com/?foo=bar')
      expect(options.method).toBe(HttpMethod.Get)
    })
  })

  describe('createPostRequest', () => {
    it('creates a POST request configuration', () => {
      const data = { foo: 'bar' }
      const { url, options } = createPostRequest('https://example.com', data)
      expect(url).toBe('https://example.com')
      expect(options.method).toBe(HttpMethod.Post)
      expect(options.body).toBe(JSON.stringify(data))
    })
  })

  describe('apiFetch', () => {
    it('fetches data using GET method', async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ foo: 'bar' }), { status: 200 }))
      const data = await apiFetchAsync('https://example.com', { foo: 'bar' })
      expect(data).toEqual({ foo: 'bar' })
    })

    it('throws ApiFetchError on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 500 }))
      await expect(apiFetchAsync('https://example.com')).rejects.toThrow(ApiFetchError)
    })
  })

  describe('withErrorHandling', () => {
    it('returns data on successful fetch', async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ foo: 'bar' }), { status: 200 }))
      const result = await withErrorHandlingAsync(apiFetchAsync, 'https://example.com')
      expect(result.data).toEqual({ foo: 'bar' })
      expect(result.error).toBeNull()
    })

    it('returns error on fetch failure', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'test error',
        bodyUsed: false,
        clone: () => mockResponse,
        json: () => Promise.resolve({}),
        headers: new Headers(),
        url: 'https://example.com',
        redirected: false,
        type: 'basic' as ResponseType,
        body: null,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
        text: () => Promise.resolve('')
      } as Response

      // Mock multiple responses for retries
      mockFetch.mockResolvedValueOnce(mockResponse)
      mockFetch.mockResolvedValueOnce(mockResponse)
      mockFetch.mockResolvedValueOnce(mockResponse)
      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await withErrorHandlingAsync(apiFetchAsync, 'https://example.com')
      expect(result.data).toBeNull()
      expect(result.error).toBeInstanceOf(ApiFetchError)
    })

    describe('networkErrorMessage', () => {
      // 502 is not retried, so a single mocked response drives the whole call.
      const respondWith = (status: number) =>
        mockFetch.mockResolvedValueOnce(new Response(null, { status }))

      it('notifies with the default message when no override is given', async () => {
        // Arrange
        setActivePinia(createPinia())
        respondWith(502)

        // Act
        await apiFetchWithErrorHandling('https://example.com')

        // Assert
        expect(useNotificationStore().messages[0].text).toBe(DEFAULT_NETWORK_ERROR_MESSAGE)
      })

      it('notifies with the override when one is given', async () => {
        // Arrange
        setActivePinia(createPinia())
        respondWith(502)

        // Act
        await apiFetchWithErrorHandling('https://example.com', undefined, {
          networkErrorMessage: 'Your message was not sent.'
        })

        // Assert
        expect(useNotificationStore().messages[0].text).toBe('Your message was not sent.')
      })

      it('resolves a provider function, so wording can be decided after the failure', async () => {
        // Arrange
        setActivePinia(createPinia())
        respondWith(502)

        // Act
        await apiFetchWithErrorHandling('https://example.com', undefined, {
          networkErrorMessage: () => Promise.resolve('We could not reach the service.')
        })

        // Assert
        expect(useNotificationStore().messages[0].text).toBe('We could not reach the service.')
      })

      it('falls back to the default when the provider throws', async () => {
        // Arrange: a broken provider must not cost the user their notification.
        setActivePinia(createPinia())
        respondWith(502)

        // Act
        await apiFetchWithErrorHandling('https://example.com', undefined, {
          networkErrorMessage: () => {
            throw new Error('probe blew up')
          }
        })

        // Assert
        expect(useNotificationStore().messages[0].text).toBe(DEFAULT_NETWORK_ERROR_MESSAGE)
      })

      it('does not invoke the provider for a 403, which has its own message', async () => {
        // Arrange
        setActivePinia(createPinia())
        respondWith(403)
        const provider = vi.fn(() => 'should not be used')

        // Act
        await apiFetchWithErrorHandling('https://example.com', undefined, {
          networkErrorMessage: provider
        })

        // Assert
        expect(provider).not.toHaveBeenCalled()
      })

      it('does not override the 403 message', async () => {
        // Arrange
        setActivePinia(createPinia())
        respondWith(403)

        // Act
        await apiFetchWithErrorHandling('https://example.com', undefined, {
          networkErrorMessage: 'Your message was not sent.'
        })

        // Assert
        expect(useNotificationStore().messages[0].text).toBe(
          'This action could not be completed. Please refresh and try again.'
        )
      })
    })
  })

  describe('apiFetchWithErrorHandling', () => {
    it('fetches data with error handling', async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ foo: 'bar' }), { status: 200 }))
      const result = await apiFetchWithErrorHandling('https://example.com')
      expect(result.data).toEqual({ foo: 'bar' })
      expect(result.error).toBeNull()
    })
  })

  describe('safeJson', () => {
    it('parses JSON response safely', async () => {
      const response = new Response(JSON.stringify({ foo: 'bar' }), { status: 200 })
      const data = await safeJsonAsync(response)
      expect(data).toEqual({ foo: 'bar' })
    })

    it('returns null on JSON parsing failure', async () => {
      const response = new Response('invalid-json', { status: 200 })
      const data = await safeJsonAsync(response)
      expect(data).toBeNull()
    })
  })
})
