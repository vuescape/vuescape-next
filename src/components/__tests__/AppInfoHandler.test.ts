import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import AppInfoHandler from '../AppInfoHandler.vue'
import { useAppInfoStore } from '../../stores/useAppInfoStore'
import VuescapeDialog from '../VuescapeDialog.vue'
import type { AppInfoStore } from '../../stores'

describe('AppInfoHandler.vue', () => {
  let wrapper: any
  let wasReloadCalled = false
  let pinia: ReturnType<typeof createPinia>
  let appInfoStore: AppInfoStore
  let startPollingSpy: any
  let stopPollingSpy: any
  let fetchAppInfoAsyncSpy: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    appInfoStore = useAppInfoStore()

    // Spy on store methods
    startPollingSpy = vi.spyOn(appInfoStore, 'startPolling').mockImplementation(() => {})
    stopPollingSpy = vi.spyOn(appInfoStore, 'stopPolling').mockImplementation(() => {})
    fetchAppInfoAsyncSpy = vi.spyOn(appInfoStore, 'fetchAppInfoAsync').mockResolvedValue()

    wrapper = mount(AppInfoHandler, {
      global: {
        plugins: [pinia],
        components: { VuescapeDialog }
      }
    })
    vi.spyOn(wrapper.vm, 'reload').mockImplementation(() => {
      wasReloadCalled = true
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should start polling when the component is mounted', () => {
    expect(startPollingSpy).toHaveBeenCalled()
  })

  it('should stop polling when the component is unmounted', () => {
    wrapper.unmount()
    expect(stopPollingSpy).toHaveBeenCalled()
  })

  it('should fetch app info when mounted', () => {
    expect(fetchAppInfoAsyncSpy).toHaveBeenCalled()
  })

  it('should render the VuescapeDialog component', () => {
    expect(wrapper.findComponent(VuescapeDialog).exists()).toBe(true)
  })

  it('should have the dialog initially hidden', () => {
    expect(wrapper.vm.isVisible).toBe(false)
    const dialog = wrapper.findComponent(VuescapeDialog)
    expect(dialog.props('modelValue')).toBe(false) // Dialog should be hidden initially
  })

  it('should show the dialog when the version changes', async () => {
    // The dialog should be hidden initially
    expect(wrapper.vm.isVisible).toBe(false)

    // Set initial version first (simulates app startup)
    appInfoStore.state.version = '1.0.0'
    await wrapper.vm.$nextTick()

    // Now change version (this should trigger the watcher with oldValue truthy)
    appInfoStore.state.version = '2.0.0'
    await wrapper.vm.$nextTick()

    // Check if the dialog is now visible
    expect(wrapper.vm.isVisible).toBe(true)
  })

  it('should reload the page when refresh is clicked', async () => {
    // Set initial version then change it to make dialog visible
    appInfoStore.state.version = '1.0.0'
    await wrapper.vm.$nextTick()
    appInfoStore.state.version = '2.0.0'
    await wrapper.vm.$nextTick()

    // Ensure the dialog is visible
    expect(wrapper.vm.isVisible).toBe(true)

    // Click OK button which triggers confirm event
    const dialog = wrapper.findComponent(VuescapeDialog)
    dialog.vm.$emit('confirm')
    await wrapper.vm.$nextTick()

    expect(wasReloadCalled).toBe(true)
  })

  it('should display the correct version in the dialog', async () => {
    // Set initial version then change it
    appInfoStore.state.version = '1.0.0'
    await wrapper.vm.$nextTick()
    appInfoStore.state.version = '2.0.0'
    await wrapper.vm.$nextTick()

    // Make sure the dialog is visible
    expect(wrapper.vm.isVisible).toBe(true)

    // Verify the dialog component has the correct version in its state
    const dialog = wrapper.findComponent(VuescapeDialog)
    expect(dialog.exists()).toBe(true)
    expect(wrapper.vm.state.version).toBe('2.0.0')
  })
})
