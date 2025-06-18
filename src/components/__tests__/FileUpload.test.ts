import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { beforeEach, describe, expect, it } from 'vitest'
import FileUpload from '../FileUpload.vue'

// Helper to create a mock File object
function createFile(name: string, size: number, type = 'text/plain') {
  return new File(['a'.repeat(size)], name, { type })
}

describe('FileUpload.vue', () => {
  let wrapper: ReturnType<typeof mount>

  // helper to simulate file selection
  const triggerFileChange = async (inputEl: HTMLInputElement, files: File[]) => {
    Object.defineProperty(inputEl, 'files', {
      value: files,
      writable: false
    })
    await inputEl.dispatchEvent(new Event('change'))
  }

  beforeEach(() => {
    wrapper = mount(FileUpload, {
      global: {
        plugins: [PrimeVue, ToastService],
        stubs: {
          Toast: true,
          PFileUpload: {
            template: `
              <div>
                <slot name="header" :chooseCallback="() => {}"></slot>
                <slot name="content" :files="[]" :removeFileCallback="() => {}"></slot>
                <slot name="empty"></slot>
              </div>
            `
          } // Stub the Toast component to avoid teleport issues
        }
      },
      props: {
        id: 'test-upload',
        title: 'Test Upload',
        isRequired: false,
        uploadInstructionText: 'Click or drag to upload a file',
        maxFileSizeInBytes: 1024 * 1024
      }
    })
  })

  it('renders the upload instruction text', () => {
    expect(wrapper.text()).toContain('Click or drag to upload a file')
  })

  it('emits files-changed when a valid file is selected', async () => {
    // Create a mock file
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' })

    // Get initial emission count
    const initialEmissions = wrapper.emitted('files-changed')?.length || 0

    // Call onSelectedFiles method directly with our test file
    await wrapper.vm.onSelectedFiles({ files: [file] })

    // Check if the files-changed event was emitted
    expect(wrapper.emitted('files-changed')).toBeTruthy()
    expect(wrapper.emitted('files-changed')?.length).toBe(initialEmissions + 1)

    // Get the latest emission
    const latestEmission = wrapper.emitted('files-changed')![initialEmissions][0]

    // Check the payload structure
    expect(latestEmission.isValid).toBe(true)
    expect(latestEmission.files).toHaveLength(1)
    expect(latestEmission.files[0].name).toBe('test.txt')
  })

  it('rejects files over max size and does not emit valid files', async () => {
    // Create a mock oversized file
    const oversizedFile = createFile('big.txt', 10 * 1024 * 1024) // 10MB

    // Call the component's method directly with our oversized file
    await wrapper.vm.onSelectedFiles({ files: [oversizedFile] })

    // Get the emitted event
    const emitted = wrapper.emitted('files-changed')

    // Check that the event was emitted
    expect(emitted).toBeTruthy()

    // Find the last emission (at least one emission happens on component mount)
    const lastEmission = emitted![emitted!.length - 1][0]

    // Check that the emitted value has the correct structure
    expect(lastEmission).toEqual({ isValid: true, files: [] })

    // Alternative, more specific assertions:
    expect(lastEmission.isValid).toBe(true)
    expect(lastEmission.files).toHaveLength(0)
  })

  it('can clear files via exposed clearFiles()', async () => {
    const input = wrapper.find('input[type="file"]')
    const validFile = createFile('good.txt', 512 * 1024)

    await triggerFileChange(input.element as HTMLInputElement, [validFile])
    expect(wrapper.emitted()['files-changed']).toBeTruthy()

    // Call the exposed method
    const vm = wrapper.vm as any
    vm.clearFiles()

    // Ensure files ref is cleared
    expect((wrapper.vm as any).files).toEqual([])
  })
})
