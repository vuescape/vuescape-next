import { createTestingPinia } from '@pinia/testing'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ReadOnlyFileUpload from '../../components/ReadOnlyFileUpload.vue'
import type { ReadOnlyFileUploadProps } from '../../models/componentProps/ReadOnlyFileUploadProps'
import { ReportPaneKind } from '../../models/feature/ReportPaneKind'
import { useActionStore } from '../../stores/useActionStore'

const defaultProps: ReadOnlyFileUploadProps = {
  id: 'file-123',
  fileName: 'document.pdf',
  fileSizeInBytes: 2048,
  downloadAction: {
    typeName: 'action.download',
    payload: { url: '/download/file-123', shouldResolveDownloadFile: false }
  }
}

vi.mock('../../infrastructure/formatters', () => ({
  formatSize: (size: number) => `${size} bytes`
}))

const createWrapper = (props: ReadOnlyFileUploadProps) => {
  const pinia = createTestingPinia({ createSpy: vi.fn, stubActions: true })
  setActivePinia(pinia)
  return mount(ReadOnlyFileUpload, {
    props,
    global: {
      plugins: [PrimeVue, pinia],
      stubs: {
        VuescapeButton: true
      }
    }
  })
}

describe('ReadOnlyFileUpload', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders file info when id is provided', async () => {
    const wrapper = createWrapper(defaultProps)
    await flushPromises()
    expect(wrapper.text()).toContain('document.pdf')
    expect(wrapper.findComponent({ name: 'VuescapeButton' }).exists()).toBe(true)
  })

  it('shows "No files available" when id is missing', async () => {
    const wrapper = createWrapper({ ...defaultProps, id: undefined })
    await flushPromises()
    expect(wrapper.text()).toContain('No files available for download.')
    expect(wrapper.findComponent({ name: 'VuescapeButton' }).exists()).toBe(false)
  })

  it('calls actionStore.dispatch with correct params on download click', async () => {
    const wrapper = createWrapper(defaultProps)
    await flushPromises()
    const actionStore = useActionStore()

    await wrapper.findComponent({ name: 'VuescapeButton' }).trigger('click')
    expect(actionStore.dispatch).toHaveBeenCalledWith(
      defaultProps.downloadAction,
      ReportPaneKind.None
    )
  })

  it('does not render download button if downloadNavigationAction is missing', async () => {
    const wrapper = createWrapper({ ...defaultProps, downloadAction: undefined as any })
    await flushPromises()
    expect(wrapper.findComponent({ name: 'VuescapeButton' }).exists()).toBe(false)
  })
})
