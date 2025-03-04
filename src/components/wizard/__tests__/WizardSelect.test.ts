import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { SelectOption } from '../../../models/dynamic-ui/SelectOption'
import WizardSelect from '../WizardSelect.vue'
import PrimeVue from 'primevue/config'

describe('WizardSelect.vue', () => {
  beforeAll(() => {
    // Provide a mock implementation of matchMedia
    window.matchMedia = vi.fn().mockImplementation((query) => {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }
    })
  })

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders the component with title and prompt text', () => {
    const wrapper = mount(WizardSelect, {
      global: {
        plugins: [PrimeVue]
      },
      props: {
        title: 'Select a Company',
        promptText: 'Please select a company from the list below.',
        selectProps: {
          options: [],
          selectedValue: undefined
        }
      }
    })

    expect(wrapper.find('h3').text()).toBe('Select a Company')
    expect(wrapper.find('p').text()).toBe('Please select a company from the list below.')
  })

  it('emits change event with selected item', async () => {
    const wrapper = mount(WizardSelect, {
      global: {
        plugins: [PrimeVue]
      },
      props: {
        title: 'Select a Company',
        promptText: 'Please select a company from the list below.',
        selectProps: {
          options: [
            { displayName: 'Company A', id: 'a' },
            { displayName: 'Company B', id: 'b' }
          ],
          selectedValue: undefined
        }
      }
    })

    const selectComponent = wrapper.findComponent({ name: 'VuescapeSelect' })
    const newSelection: SelectOption = { displayName: 'Company A', id: 'a' }

    await selectComponent.vm.$emit('change', { value: newSelection })

    expect(wrapper.emitted().change).toBeTruthy()
    expect(wrapper.emitted().change[0]).toEqual([newSelection])
  })
})
