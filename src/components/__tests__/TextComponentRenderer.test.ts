import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TextComponentRenderer from '../../components/TextComponentRenderer.vue'
import type { TextComponentPayload } from '../../models/dynamic-ui/pane-components/TextComponentPayload'

describe('TextComponentRenderer', () => {
  it('renders the title text passed as prop', () => {
    const payload: TextComponentPayload = { text: 'Hello World', id: 'title-1', renderTextAs: 'header' }
    const wrapper = mount(TextComponentRenderer, {
      props: payload
    })
    expect(wrapper.text()).toContain('Hello World')
    expect(wrapper.find('.header').exists()).toBe(true)
  })

  it('renders nothing if text prop is empty', () => {
    const payload: TextComponentPayload = { text: '', id: 'title-1', renderTextAs: 'header' }
    const wrapper = mount(TextComponentRenderer, {
      props: payload
    })
    expect(wrapper.find('.header').text()).toBe('')
  })
})
