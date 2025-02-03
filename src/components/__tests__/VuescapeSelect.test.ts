import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VuescapeSelectProps } from '../../models/componentProps/VuescapeSelectProps'
import VuescapeSelect from '../VuescapeSelect.vue'
import PrimeVueSelect from 'primevue/select'
import PrimeVue from 'primevue/config'

const props: VuescapeSelectProps = {
  options: [{ name: 'Option 1' }, { name: 'Option 2' }],
  value: { name: 'Option 1' },
  name: 'test-select',
  optionLabel: 'name',
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

  beforeEach(() => {
    wrapper = createWrapper(props, attrs)
  })

  it('renders the select component', () => {
    expect(wrapper.findComponent({ name: 'select' }).exists()).toBe(true)
  })

  it('passes the correct props to the select component', () => {
    const selectComponent = wrapper.findComponent({ name: 'select' })
    expect(selectComponent.props().options).toEqual(props.options)
    expect(selectComponent.props().modelValue).toEqual(props.value)
    expect(selectComponent.props().name).toBe(props.name)
    expect(selectComponent.props().optionLabel).toBe(props.optionLabel)
    expect(selectComponent.props().placeholder).toBe(props.placeholder)
    expect(selectComponent.props().disabled).toBe(props.disabled)
    // Class is not part of the API so no need to test here.
    // Next test will check if the class is applied.
  })

  it('applies the correct class', () => {
    expect(wrapper.find('.custom-class').exists()).toBe(true)
  })

  it('renders the correct placeholder', () => {
    wrapper = createWrapper({ ...props, value: null }, attrs)
    expect(wrapper.find('span.p-placeholder').attributes('aria-label')).toBe(props.placeholder)
  })
})
