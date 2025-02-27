import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import PrimeVueSelect from 'primevue/select'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { VuescapeSelectProps } from '../../models/componentProps/VuescapeSelectProps'
import VuescapeSelect from '../VuescapeSelect.vue'

const props: VuescapeSelectProps = {
  options: [
    { displayName: 'Option 1', id: '1' },
    { displayName: 'Option 2', id: '2' }
  ],
  selectedValue: { displayName: 'Option 1', id: '1' },
  name: 'test-select',
  placeholder: 'Select One of the Options',
  disabled: false,
  cssClass: 'custom-class'
}

const attrs = {
  'data-test': 'my-select',
  onChange: vi.fn()
  //onUpdateModelValue: vi.fn()
}

const createWrapper = (propsData: VuescapeSelectProps, attrsData: any) => {
  return mount(VuescapeSelect, {
    global: {
      plugins: [
        PrimeVue,
        createTestingPinia({
          createSpy: vi.fn
        })
      ],
      components: {
        Select: PrimeVueSelect
      }
    },
    props: propsData,
    attrs: attrsData
  })
}
describe('VuescapeSelect.vue', () => {
  let wrapper

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
    wrapper = createWrapper(props, attrs)
  })

  it('renders the select component', () => {
    expect(wrapper.findComponent({ name: 'select' }).exists()).toBe(true)
  })

  it('passes the correct props to the select component', () => {
    const selectComponent = wrapper.findComponent({ name: 'select' })
    expect(selectComponent.props().options).toEqual(props.options)
    expect(selectComponent.props().modelValue).toEqual(props.selectedValue)
    expect(selectComponent.props().name).toBe(props.name)
    expect(selectComponent.props().placeholder).toBe(props.placeholder)
    expect(selectComponent.props().disabled).toBe(props.disabled)
    // Class is not part of the API so no need to test here.
    // Next test will check if the class is applied.
  })

  it('applies the correct class', () => {
    expect(wrapper.find('.custom-class').exists()).toBe(true)
  })

  it('renders the correct placeholder', () => {
    wrapper = createWrapper({ ...props, selectedValue: undefined }, attrs)
    expect(wrapper.find('span.p-placeholder').attributes('aria-label')).toBe(props.placeholder)
  })
})
