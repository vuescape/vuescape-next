import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AppInfoHandler from '../AppInfoHandler.vue'
import { useAppInfoStore } from '../../stores/useAppInfoStore'
import VuescapeDialog from '../VuescapeDialog.vue'
import { reactive } from 'vue'
import { AppInfo } from '../../models'
import { AppInfoStore } from '../../stores'

// Mock the AppInfoStore
const startPollingMock = vi.fn()
const fetchAppInfoAsyncMock = vi.fn()
const stopPollingMock = vi.fn()

const state = reactive({ version: '1.0.0', messages: [], disabledFeatures: [] })
vi.mock('@/stores/useAppInfoStore', () => ({
  useAppInfoStore: vi.fn(() => ({
    state,
    fetchAppInfoAsync: fetchAppInfoAsyncMock,
    startPolling: startPollingMock,
    stopPolling: stopPollingMock,
    setAppInfoState: vi.fn((appInfo: AppInfo) => {
      state.version = appInfo.version
    })
  }))
}))

describe('AppInfoHandler.vue', () => {
  let wrapper: any
  let wasReloadCalled = false
  beforeEach(() => {
    wrapper = mount(AppInfoHandler, {
      global: {
        components: { VuescapeDialog }
      }
    })
    vi.spyOn(wrapper.vm, 'reload').mockImplementation(() => {
      wasReloadCalled = true
    })
  })

  it('should start polling when the component is mounted', () => {
    expect(startPollingMock).toHaveBeenCalled()
  })

  it('should stop polling when the component is unmounted', () => {
    wrapper.unmount()
    expect(stopPollingMock).toHaveBeenCalled()
  })

  it('should fetch app info when mounted', () => {
    expect(fetchAppInfoAsyncMock).toHaveBeenCalled()
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
    const appInfoStore = useAppInfoStore() as unknown as AppInfoStore

    // The dialog should be hidden initially
    expect(wrapper.vm.isVisible).toBe(false)

    // Simulate a version change
    appInfoStore.setAppInfoState({ version: '2.0.0', messages: [], disabledFeatures: [] })

    await wrapper.vm.$nextTick()

    // Check if the dialog is now visible
    expect(wrapper.vm.isVisible).toBe(true)
  })

  it('should reload the page when refresh is clicked', async () => {
    // Simulate version change to make the dialog visible
    const appInfoStore = useAppInfoStore()
    appInfoStore.setAppInfoState({ version: '2.0.0', messages: [], disabledFeatures: [] })
    await wrapper.vm.$nextTick()

    // Ensure the dialog is visible and teleported to the body
    const dialog = document.body.querySelector('.vuescape-dialog__pv-dialog-header--color')
    expect(dialog).toBeTruthy() // Make sure the dialog is in the DOM

    // Find the button inside the teleported dialog
    const refreshButton = dialog!.querySelector('button') // Use appropriate selector for the button
    expect(refreshButton).toBeTruthy() // Ensure the button exists

    // Trigger the click event on the button
    refreshButton!.click()

    expect(wasReloadCalled).toBe(true)
  })

  it('should display the correct version in the dialog', async () => {
    // Make sure the dialog is visible
    wrapper.vm.isVisible = true
    await wrapper.vm.$nextTick()

    const dialog = document.body.querySelector('.vuescape-dialog__pv-dialog-header--color')
    expect(dialog?.innerHTML).toContain('2.0.0')
  })
})
