// @ts-ignore TS2339
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import fetchMocker from 'vitest-fetch-mock'
import type { AppInfoStore } from '../AppInfoStore'
import { useAppInfoStore } from '../useAppInfoStore'

const fetchMock = fetchMocker(vi)

fetchMock.enableMocks()

const useMockTimers = (vi: any) => {
  vi.useFakeTimers()
  vi.spyOn(global, 'setInterval')
  vi.spyOn(global, 'clearInterval')
}

describe('useAppInfoStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    fetchMock.resetMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
    fetchMock.resetMocks()
  })

  it('initializes with default state', () => {
    const store = useAppInfoStore() as AppInfoStore
    expect(store.state).toEqual({
      disabledFeatures: [],
      messages: [],
      version: ''
    })
  })

  it('fetchAppInfoAsync updates state on successful fetch', async () => {
    const mockAppInfo = {
      disabledFeatures: ['feature1'],
      messages: ['Welcome'],
      version: '1.0.0'
    }
    fetchMock.mockResponseOnce(JSON.stringify(mockAppInfo))

    const store = useAppInfoStore() as AppInfoStore
    await store.fetchAppInfoAsync()

    expect(store.state).toEqual(mockAppInfo)
  })

  it('fetchAppInfoAsync does not update state on failed fetch', async () => {
    vi.spyOn(global, 'setTimeout')
    const store = useAppInfoStore() as AppInfoStore

    // @ts-ignore TS2339
    const initialState = store.state.value
    fetchMock.mockAbort()

    await store.fetchAppInfoAsync()

    // @ts-ignore TS2339
    expect(store.state.value).toEqual(initialState)
    expect(setTimeout).toHaveBeenCalledTimes(4)
  })

  it('startPolling starts polling for app info', () => {
    useMockTimers(vi)
    const store = useAppInfoStore() as AppInfoStore
    store.startPolling(1000)
    expect(setInterval).toHaveBeenCalledTimes(1)
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 1000)
  })

  it('stopPolling stops polling for app info', () => {
    useMockTimers(vi)
    const store = useAppInfoStore() as AppInfoStore
    store.startPolling(1000)
    store.stopPolling()
    expect(clearInterval).toHaveBeenCalledTimes(1)
  })
})
