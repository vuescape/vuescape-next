import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ReadOnlyFileUpload from '../../components/ReadOnlyFileUpload.vue'
import type { ReadOnlyFileUploadProps } from '../../models/componentProps/ReadOnlyFileUploadProps'
import { ReportPaneKind } from '../../models/feature/ReportPaneKind'
import { useActionStore } from '../../stores/useActionStore'

const defaultProps: ReadOnlyFileUploadProps = {
  id: 'file-123',
  title: 'Test File',
  fileName: 'document.pdf',
  fileSizeInBytes: 2048,
  downloadNavigationAction: { type: 'navigate', payload: { url: '/download/file-123' } }
}

vi.mock('../stores/useActionStore', () => ({
  useActionStore: () => ({
    $patch: vi.fn()
  })
}))

vi.mock('primevue/config', () => ({
  usePrimeVue: () => ({
    config: { locale: { fileSizeTypes: ['B', 'KB', 'MB', 'GB'] } }
  })
}))

vi.mock('../infrastructure/formatters', () => ({
  formatSize: (size: number) => `${size} bytes`
}))

const createWrapper = (props: ReadOnlyFileUploadProps) => {
  const result = mount(ReadOnlyFileUpload, {
    props,
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn
        })
      ]
    }
  })
  return result
}
describe('ReadOnlyFileUpload', () => {
  it('renders file info when id is provided', () => {
    const wrapper = createWrapper(defaultProps)
    expect(wrapper.text()).toContain('Test File')
    expect(wrapper.text()).toContain('document.pdf')
    expect(wrapper.text()).toContain('2 KB')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('shows "No files available" when id is missing', () => {
    const wrapper = createWrapper({ ...defaultProps, id: undefined })
    expect(wrapper.text()).toContain('No files available for download.')
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('calls actionStore.$patch with correct params on download click', async () => {
    const wrapper = createWrapper(defaultProps)
    const actionStore = useActionStore()

    await wrapper.find('button').trigger('click')
    expect(actionStore.$patch).toHaveBeenCalledWith({
      action: defaultProps.downloadNavigationAction,
      paneKind: ReportPaneKind.None
    })
  })

  it('does not call $patch if downloadNavigationAction is missing', async () => {
    const wrapper = createWrapper({ ...defaultProps, downloadNavigationAction: undefined })
    const actionStore = useActionStore()
    await wrapper.find('button').trigger('click')
    expect(actionStore.$patch).not.toHaveBeenCalled()
  })
})
