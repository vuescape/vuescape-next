import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import TextLinkComponent from '../TextLinkComponentRenderer.vue'
import * as ActionHandlers from '../../models/dynamic-ui/actions/ActionHandlers'

const navigationActionMock = {
  typeName: 'action.navigate',
  payload: {
    url: '/test-url'
  }
}

const props = {
  id: 'test-link',
  text: 'Test Link',
  action: navigationActionMock,
  navigationAction: navigationActionMock
}

describe('TextLinkComponent', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  const createWrapper = (props: any) => {
    return mount(TextLinkComponent, {
      props,
      global: {
        plugins: [pinia]
      }
    })
  }

  it('renders link text', () => {
    const wrapper = createWrapper(props)
    expect(wrapper.text()).toContain('Test Link')
  })

  it('renders correct href', () => {
    const wrapper = createWrapper(props)
    expect(wrapper.find('a').attributes('href')).toBe('/test-url')
  })

  it('calls handleActionEvent on click', async () => {
    const handleActionEventSpy = vi.spyOn(ActionHandlers, 'handleActionEvent').mockImplementation(() => {})
    const wrapper = createWrapper(props)

    await wrapper.find('a').trigger('click')

    expect(handleActionEventSpy).toHaveBeenCalledWith(
      expect.any(Object), // event
      props.action,
      expect.any(Object)  // actionStore
    )
  })

  it('prevents default navigation', async () => {
    const wrapper = createWrapper(props)
    const link = wrapper.find('a')
    const event = new Event('click')
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

    link.element.dispatchEvent(event)

    expect(preventDefaultSpy).toHaveBeenCalled()
  })
})
