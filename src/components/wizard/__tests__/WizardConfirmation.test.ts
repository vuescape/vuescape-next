import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WizardConfirmation from '../WizardConfirmation.vue'
import PrimeVue from 'primevue/config'
import { nextTick } from 'vue'

const defaultProps = {
  title: 'Confirm Action',
  messageHtml: '<b>Are you sure?</b>',
  confirmationCheckboxLabel: 'I agree'
}

describe('WizardConfirmation.vue', () => {
  it('renders title and messageHtml', () => {
    const wrapper = mount(WizardConfirmation, {
      props: defaultProps,
      global: {
        plugins: [PrimeVue]
      }
    })
    expect(wrapper.text()).toContain(defaultProps.title)
    expect(wrapper.html()).toContain(defaultProps.messageHtml)
  })

  it('renders confirmationCheckboxLabel', () => {
    const wrapper = mount(WizardConfirmation, {
      props: defaultProps,
      global: {
        plugins: [PrimeVue]
      }
    })
    expect(wrapper.text()).toContain(defaultProps.confirmationCheckboxLabel)
  })

  it('emits update on mount', async () => {
    const wrapper = mount(WizardConfirmation, {
      props: defaultProps,
      global: { plugins: [PrimeVue] }
    })

    // On mount: only update emitted with false
    expect(wrapper.emitted('update')).toEqual([[false]])
    expect(wrapper.emitted('can-continue')).toBeUndefined()
  })

  it('emits emits update + can-continue when checked', async () => {
    const wrapper = mount(WizardConfirmation, {
      props: defaultProps,
      global: { plugins: [PrimeVue] }
    })

    // Simulate checking the box
    const input = wrapper.find('input.p-checkbox-input')
    await input.setValue(true)

    // After check: update + can-continue emitted with true
    expect(wrapper.emitted('update')).toEqual([[false], [true]])
    expect(wrapper.emitted('can-continue')).toEqual([[true]])
  })

  it('renders default label if confirmationCheckboxLabel is not provided', () => {
    const wrapper = mount(WizardConfirmation, {
      props: {
        ...defaultProps,
        confirmationCheckboxLabel: undefined
      },
      global: {
        plugins: [PrimeVue]
      }
    })
    expect(wrapper.text()).toContain('Click to continue')
  })
})
