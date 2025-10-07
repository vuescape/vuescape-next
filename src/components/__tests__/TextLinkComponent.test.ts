import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import TextLinkComponent from '../TextLinkComponent.vue'

const navigationActionMock = {
  typeName: 'action.navigate',
  payload: {
    url: '/test-url'
  }
}
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/test-url', component: { template: '<div>Test Page</div>' } },
    { path: '/:pathMatch(.*)*', component: { template: '<div>Not Found</div>' } }
  ]
})

// Mock the router's push method
router.push = vi.fn()

const props = {
  text: 'Test Link',
  navigationAction: navigationActionMock
}

describe('TextLinkComponent', () => {
  it('renders link text', () => {
    const wrapper = mount(TextLinkComponent, { props })
    expect(wrapper.text()).toContain('Test Link')
  })

  it('renders correct href', () => {
    const wrapper = mount(TextLinkComponent, { props })
    expect(wrapper.find('a').attributes('href')).toBe('/test-url')
  })

  // TODO: Uncomment this test to test the click handler
  it.skip('calls handleClickAsync on click', async () => {
    const wrapper = mount(TextLinkComponent, { props })

    // Spy on the component's method
    const handleClickSpy = vi.spyOn(wrapper.vm, 'handleClickAsync')

    // Create a mock event
    const preventDefault = vi.fn()
    const mockEvent = { preventDefault }

    // Call the method directly instead of triggering a click
    await wrapper.vm.handleClickAsync(mockEvent)

    // Check that the method was called
    expect(handleClickSpy).toHaveBeenCalled()
    expect(preventDefault).toHaveBeenCalled()
  })

  it('prevents default navigation', async () => {
    const wrapper = mount(TextLinkComponent, { props })
    const preventDefault = vi.fn()
    await wrapper.find('a').trigger('click', { preventDefault })
    expect(preventDefault).toHaveBeenCalled()
  })
})
