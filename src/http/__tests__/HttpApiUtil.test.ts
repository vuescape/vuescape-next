import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpMethod } from '../HttpMethod'
import {
  usingRetryForFetch,
  constructUrl,
  prepareRequest,
  createGetRequest,
  createPostRequest,
  apiFetch,
  withErrorHandling,
  apiFetchWithErrorHandling,
  safeJson
} from '../HttpApiUtil'
import { ApiFetchError } from '../../models/ApiFetchError'
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

      const response = await usingRetryForFetch('https://example.com', {}, [500])
      expect(response.status).toBe(200)
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    it('returns response on client errors without retrying', async () => {
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 400 }))

      const response = await usingRetryForFetch('https://example.com')
      expect(response.status).toBe(400)
      expect(mockFetch).toHaveBeenCalledTimes(1)
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
      const data = await apiFetch('https://example.com', { foo: 'bar' })
      expect(data).toEqual({ foo: 'bar' })
    })

    it('throws ApiFetchError on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 500 }))
      await expect(apiFetch('https://example.com')).rejects.toThrow(ApiFetchError)
    })
  })

  describe('withErrorHandling', () => {
    it('returns data on successful fetch', async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ foo: 'bar' }), { status: 200 }))
      const result = await withErrorHandling(apiFetch, 'https://example.com')
      expect(result.data).toEqual({ foo: 'bar' })
      expect(result.error).toBeNull()
    })

    it('returns error on fetch failure', async () => {
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 500 }))
      const result = await withErrorHandling(apiFetch, 'https://example.com')
      expect(result.data).toBeNull()
      expect(result.error).toBeInstanceOf(ApiFetchError)
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
      const data = await safeJson(response)
      expect(data).toEqual({ foo: 'bar' })
    })

    it('returns null on JSON parsing failure', async () => {
      const response = new Response('invalid-json', { status: 200 })
      const data = await safeJson(response)
      expect(data).toBeNull()
    })
  })
})
