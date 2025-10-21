import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import TextLinkComponent from '../TextLinkComponentRenderer.vue'

// Mock the action store
vi.mock('../../stores/useActionStore', () => ({
  useActionStore: () => ({
    dispatch: vi.fn()
  })
}))

// Mock the action handler
vi.mock('../../models/dynamic-ui/actions/ActionHandlers', () => ({
  handleActionEvent: vi.fn()
}))

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
  const createWrapper = (props: any) => {
    return mount(TextLinkComponent, { props })
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
    const { handleActionEvent } = await import('../../models/dynamic-ui/actions/ActionHandlers')
    const wrapper = createWrapper(props)

    await wrapper.find('a').trigger('click')

    expect(handleActionEvent).toHaveBeenCalledWith(
      expect.any(Object), // event
      props.action,
      expect.any(Object)  // actionStore
    )
  })

  it('prevents default navigation', async () => {
    const wrapper = createWrapper(props)
    const preventDefault = vi.fn()
    await wrapper.find('a').trigger('click', { preventDefault })
    expect(preventDefault).toHaveBeenCalled()
  })
})
