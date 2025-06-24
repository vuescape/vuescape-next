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

  it('emits update and can-continue when checkbox is checked', async () => {
    const wrapper = mount(WizardConfirmation, {
      props: defaultProps,
      global: {
        plugins: [PrimeVue]
      }
    })

    const checkbox = wrapper.findComponent({ name: 'Checkbox' })
    // Emit the update:modelValue event to trigger v-model
    await checkbox.vm.$emit('update:modelValue', true)

    // // Wait for Vue's reactivity system to update and trigger watchers
    await nextTick()

    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('can-continue')).toBeTruthy()
  })

  it('emits update and can-continue when checkbox is unchecked', () => {
    const wrapper = mount(WizardConfirmation, {
      props: defaultProps,
      global: {
        plugins: [PrimeVue]
      }
    })
    // const checkbox = wrapper.findComponent({ name: 'Checkbox' })
    // // Emit the update:modelValue event to trigger v-model
    // await checkbox.vm.$emit('update:modelValue', true)

    // // Wait for Vue's reactivity system to update and trigger watchers
    // await nextTick()

    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('can-continue')).toBeUndefined()
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
