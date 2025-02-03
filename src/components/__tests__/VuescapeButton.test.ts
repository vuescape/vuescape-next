import { mount } from '@vue/test-utils'
import Button from 'primevue/button'
import { describe, expect, it } from 'vitest'
import VuescapeButton from '../VuescapeButton.vue'

describe('VuescapeButton', () => {
  it('renders with default props', () => {
    const wrapper = mount(VuescapeButton)
    const button = wrapper.findComponent(Button)
    expect(button.props('label')).toBe('Submit')
    expect(button.props('icon')).toBe('')
    expect(button.props('iconPos')).toBe('')
    expect(button.props('disabled')).toBeUndefined()
    expect(button.classes()).not.toContain('vuescape-button--with-icon')
  })

  it('renders with custom label and icon', () => {
    const wrapper = mount(VuescapeButton, {
      props: {
        label: 'Custom Label',
        icon: 'pi pi-check',
        iconPos: 'right',
      },
    })
    const button = wrapper.findComponent(Button)

    expect(button.props('label')).toBe('Custom Label')
    expect(button.props('icon')).toBe('pi pi-check')
    expect(button.props('iconPos')).toBe('right')
    expect(button.classes()).toContain('vuescape-button--with-icon')
  })

  it('applies disabled prop', async () => {
    const wrapper = mount(VuescapeButton, {
      props: { disabled: true },
    })
    const button = wrapper.findComponent(Button)
    await button.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
    expect(button.props('disabled')).toBeUndefined()
  })

  it('applies class prop as string', () => {
    const wrapper = mount(VuescapeButton, {
      props: { cssClass: 'custom-class' },
    })
    const button = wrapper.findComponent(Button)

    expect(button.classes()).toContain('custom-class')
  })

  it('applies class prop as object', () => {
    const wrapper = mount(VuescapeButton, {
      props: { cssClass: { 'custom-class': true, 'another-class': false } },
    })
    const button = wrapper.findComponent(Button)

    expect(button.classes()).toContain('custom-class')
    expect(button.classes()).not.toContain('another-class')
  })

  it('emits click event', async () => {
    const wrapper = mount(VuescapeButton)
    const button = wrapper.findComponent(Button)

    await button.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
