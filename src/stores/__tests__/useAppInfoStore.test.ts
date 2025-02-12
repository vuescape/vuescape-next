import type { Ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import fetchMocker from 'vitest-fetch-mock'

import type { AppInfoStore } from '../AppInfoStore'
import { useAppInfoStore } from '../useAppInfoStore'
import type { AppInfo } from '../../models/AppInfo'
import { beforeAll } from 'vitest'

const fetchMock = fetchMocker(vi)

const useMockTimers = (vi: any) => {
  vi.useFakeTimers()
  vi.spyOn(global, 'setInterval')
  vi.spyOn(global, 'clearInterval')
}

describe('useAppInfoStore', () => {
  beforeAll(() => {
    fetchMock.enableMocks()
  })
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

    const appInfo: Ref<AppInfo> = store.state as Ref<AppInfo>
    const initialState = appInfo.value
    fetchMock.mockImplementation(() => Promise.resolve(new Response(null, { status: 500 })))
    await store.fetchAppInfoAsync()

    expect(appInfo.value).toEqual(initialState)
    expect(setTimeout).toHaveBeenCalledTimes(2)
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
