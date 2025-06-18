import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TitleComponentRenderer from '../../components/TitleComponentRenderer.vue'
import type { TitleComponentPayload } from '../../models/dynamic-ui/pane-components/TitleComponentPayload'

describe('TitleComponentRenderer', () => {
  it('renders the title text passed as prop', () => {
    const payload: TitleComponentPayload = { text: 'Hello World' }
    const wrapper = mount(TitleComponentRenderer, {
      props: payload
    })
    expect(wrapper.text()).toContain('Hello World')
    expect(wrapper.find('.title').exists()).toBe(true)
  })

  it('renders nothing if text prop is empty', () => {
    const payload: TitleComponentPayload = { text: '' }
    const wrapper = mount(TitleComponentRenderer, {
      props: payload
    })
    expect(wrapper.find('.title').text()).toBe('')
  })
})
