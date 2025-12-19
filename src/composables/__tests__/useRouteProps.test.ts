import { describe, expect, it, vi } from 'vitest'
import { useRoute, useRouter } from 'vue-router'
import { useRouteProps } from '../useRouteProps'

vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
  useRoute: vi.fn()
}))

describe('useRouteProps', () => {
  it('should initialize route state if initialState is provided', () => {
    const mockPush = vi.fn()
    const mockRoute = {
      params: { productId: '123' },
      query: { filter: 'all' }
    }

    vi.mocked(useRouter).mockReturnValue({ push: mockPush })
    vi.mocked(useRoute).mockReturnValue(mockRoute)

    useRouteProps({
      productId: '456',
      filter: 'top-rated'
    })

    expect(mockPush).toHaveBeenCalledExactlyOnceWith({
      params: { productId: '456' },
      query: { filter: 'top-rated' }
    })
  })

  it('should update route params and query when updateRoute is called', () => {
    const mockPush = vi.fn()
    const mockRoute = {
      params: { productId: '123' },
      query: { filter: 'all' }
    }

    vi.mocked(useRouter).mockReturnValue({ push: mockPush })
    vi.mocked(useRoute).mockReturnValue(mockRoute)

    const { updateRouteProps } = useRouteProps()

    updateRouteProps({
      productId: '789',
      filter: 'new-filter'
    })

    expect(mockPush).toHaveBeenCalledExactlyOnceWith({
      params: { productId: '789' },
      query: { filter: 'new-filter' }
    })
  })

  it('should merge updates with existing route params and query', () => {
    const mockPush = vi.fn()
    const mockRoute = {
      params: { productId: '123', entityId: '456' },
      query: { filter: 'all', sort: 'asc' }
    }

    vi.mocked(useRouter).mockReturnValue({ push: mockPush })
    vi.mocked(useRoute).mockReturnValue(mockRoute)

    const { updateRouteProps } = useRouteProps()

    updateRouteProps({
      productId: '789',
      sort: 'desc'
    })

    expect(mockPush).toHaveBeenCalledExactlyOnceWith({
      params: { productId: '789', entityId: '456' },
      query: { filter: 'all', sort: 'desc' }
    })
  })

  it('should not call router.push if no updates are provided', () => {
    const mockPush = vi.fn()
    const mockRoute = {
      params: { productId: '123' },
      query: { filter: 'all' }
    }

    vi.mocked(useRouter).mockReturnValue({ push: mockPush })
    vi.mocked(useRoute).mockReturnValue(mockRoute)

    const { updateRouteProps } = useRouteProps()

    updateRouteProps({})

    expect(mockPush).not.toHaveBeenCalled()
  })
})
