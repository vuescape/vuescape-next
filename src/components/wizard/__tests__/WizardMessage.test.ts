import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import WizardMessage from '../WizardMessage.vue'
import VuescapeButton from '../../VuescapeButton.vue'

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

  it('renders button when buttonText is provided', async () => {
    const wrapper = mount(WizardMessage, {
      props: {
        buttonText: 'Click Me',
        messageHtml: ''
      },
      global: {
        stubs: {
          VuescapeButton
        }
      }
    })
    await flushPromises()
    const button = wrapper.findComponent({ name: 'VuescapeButton' })
    expect(button.exists()).toBe(true)
    expect(button.props('label')).toBe('Click Me')
  })

  it('does not render button when buttonText is not provided', async () => {
    const wrapper = mount(WizardMessage, {
      props: {
        messageHtml: ''
      },
      global: {
        stubs: {
          VuescapeButton
        }
      }
    })
    await flushPromises()
    expect(wrapper.findComponent({ name: 'VuescapeButton' }).exists()).toBe(false)
  })

  it('calls onclick when button is clicked', async () => {
    const onClick = vi.fn()
    const wrapper = mount(WizardMessage, {
      props: {
        buttonText: 'Click',
        onclick: onClick,
        messageHtml: ''
      },
      global: {
        stubs: {
          VuescapeButton
        }
      }
    })
    await flushPromises()
    await wrapper.findComponent({ name: 'VuescapeButton' }).trigger('click')
    expect(onClick).toHaveBeenCalled()
  })
})
