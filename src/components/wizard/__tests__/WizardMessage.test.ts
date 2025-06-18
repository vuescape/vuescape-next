import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WizardMessage from '../WizardMessage.vue'

describe('WizardMessage.vue', () => {
  it('renders title when provided', () => {
    const wrapper = mount(WizardMessage, {
      props: {
        title: 'Test Title',
        messageHtml: ''
      }
    })
    expect(wrapper.text()).toContain('Test Title')
  })

  it('renders messageHtml as HTML', () => {
    const html = '<b>Bold Message</b>'
    const wrapper = mount(WizardMessage, {
      props: {
        messageHtml: html
      }
    })
    expect(wrapper.html()).toContain(html)
  })

  it('renders button when buttonText is provided', () => {
    const wrapper = mount(WizardMessage, {
      props: {
        buttonText: 'Click Me',
        messageHtml: ''
      }
    })
    expect(wrapper.findComponent({ name: 'VuescapeButton' }).exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('Click Me')
  })

  it('does not render button when buttonText is not provided', () => {
    const wrapper = mount(WizardMessage, {
      props: {
        messageHtml: ''
      }
    })
    expect(wrapper.findComponent({ name: 'VuescapeButton' }).exists()).toBe(false)
  })

  it('calls onclick when button is clicked', async () => {
    const onClick = vi.fn()
    const wrapper = mount(WizardMessage, {
      props: {
        buttonText: 'Click',
        onclick: onClick,
        messageHtml: ''
      }
    })
    await wrapper.find('button').trigger('click')
    expect(onClick).toHaveBeenCalled()
  })
})
