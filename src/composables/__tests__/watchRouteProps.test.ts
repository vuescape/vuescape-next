import { describe, expect, it, vi } from 'vitest'
import { nextTick, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { watchRouteProps } from '../watchRouteProps'

vi.mock('vue-router', () => ({
  useRoute: vi.fn()
}))

describe('watchRouteProps', () => {
  it('should call the handler when a param changes', async () => {
    const mockRoute = reactive({
      params: { productId: '123' },
      query: {}
    })

    vi.mocked(useRoute).mockReturnValue(mockRoute)

    const handler = vi.fn()

    watchRouteProps({
      productId: handler
    })

    // Trigger change
    Object.assign(mockRoute.params, { productId: '456' })
    await nextTick()

    expect(handler).toHaveBeenCalledOnce()
    expect(handler).toHaveBeenCalledWith('456', '123')
  })

  it('should call the handler when a query parameter changes', async () => {
    const mockRoute = reactive({
      params: {},
      query: { filter: 'all' }
    })

    vi.mocked(useRoute).mockReturnValue(mockRoute)

    const handler = vi.fn()

    watchRouteProps({
      filter: handler
    })

    // Trigger change
    // mockRoute.query = { ...mockRoute.query, filter: 'top-rated' }
    Object.assign(mockRoute.query, { filter: 'top-rated' })

    // Wait for reactivity to process
    await nextTick()

    expect(handler).toHaveBeenCalledOnce()
    expect(handler).toHaveBeenCalledWith('top-rated', 'all')
  })

  it('should normalize array values and call the handler with the first value', async () => {
    const mockRoute = reactive({
      params: {},
      query: { filter: ['first', 'second'] }
    })

    vi.mocked(useRoute).mockReturnValue(mockRoute)

    const handler = vi.fn()

    watchRouteProps({
      filter: handler
    })

    // Trigger change
    // mockRoute.query = { ...mockRoute.query, filter: ['new-value', 'other'] }
    Object.assign(mockRoute.query, { filter: ['new-value', 'other'] })

    // Wait for reactivity to process
    await nextTick()

    expect(handler).toHaveBeenCalledOnce()
    expect(handler).toHaveBeenCalledWith('new-value', 'first')
  })

  it('should not call the handler for unrelated changes', async () => {
    const mockRoute = reactive({
      params: { productId: '123' },
      query: { filter: 'all' }
    })

    vi.mocked(useRoute).mockReturnValue(mockRoute)

    const handler = vi.fn()

    watchRouteProps({
      productId: handler
    })

    // Trigger change to an unrelated key
    // mockRoute.query = { ...mockRoute.query, filter: 'top-rated' }
    Object.assign(mockRoute.query, { filter: 'top-rated' })
    // Wait for reactivity to process
    await nextTick()

    expect(handler).not.toHaveBeenCalled()
  })

  it('should warn about invalid keys in handlers', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const mockRoute = reactive({
      params: { productId: '123' },
      query: { filter: 'all' }
    })

    vi.mocked(useRoute).mockReturnValue(mockRoute)

    watchRouteProps({
      invalidKey: vi.fn()
    })

    // Wait for reactivity to process
    await nextTick()

    expect(consoleWarnSpy).toHaveBeenCalledOnce()
    expect(consoleWarnSpy).toBeCalledWith(`[watchRoute] Invalid key detected: invalidKey. If this key is part of the query string then this warning can be ignored.`)

    consoleWarnSpy.mockRestore()
  })
})
