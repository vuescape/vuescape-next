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
        plugins: [PrimeVue, ToastService]
      },
      props: {
        uploadInstructionText: 'Click or drag to upload a file',
        maxFileSizeInBytes: 1024 * 1024 // 1MB max
      }
    })
  })

  it('renders the upload instruction text', () => {
    expect(wrapper.text()).toContain('Click or drag to upload a file')
  })

  it('emits files-changed when a valid file is selected', async () => {
    const input = wrapper.find('input[type="file"]')
    const file = createFile('valid.txt', 500_000)

    // Simulate file selection (real DOM event)
    const fileList = [file]

    Object.defineProperty(input.element, 'files', {
      value: fileList,
      writable: false
    })

    await input.trigger('change')

    expect(wrapper.emitted()['files-changed']).toBeTruthy()
    expect(wrapper.emitted()['files-changed']![0][0][0].name).toBe('valid.txt')
  })

  it('rejects files over max size and does not emit valid files', async () => {
    const input = wrapper.find('input[type="file"]')
    const oversizedFile = createFile('big.txt', 10 * 1024 * 1024) // 10MB

    await triggerFileChange(input.element as HTMLInputElement, [oversizedFile])

    const emitted = wrapper.emitted()['files-changed']
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toEqual([]) // emitted, but with empty file list
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
