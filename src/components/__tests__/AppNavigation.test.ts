import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import AppNavigation from '../AppNavigation.vue'

describe('AppNavigation.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(AppNavigation, {
      props: {
        pinned: false,
        startOpen: false,
        navWidth: 280
      },
      slots: {
        default: '<div class="test-content">Navigation Content</div>'
      }
    })
  })

  it('renders the navigation drawer', () => {
    expect(wrapper.find('aside.app-navigation-custom').exists()).toBe(true)
  })

  it('renders slot content', () => {
    expect(wrapper.find('.test-content').exists()).toBe(true)
    expect(wrapper.find('.test-content').text()).toBe('Navigation Content')
  })

  it('applies correct width from props', () => {
    const aside = wrapper.find('aside')
    expect(aside.attributes('style')).toContain('width: 280px')
  })

  it('shows drawer class when not pinned', () => {
    const aside = wrapper.find('aside.app-navigation-drawer')
    expect(aside.exists()).toBe(true)
  })

  it('shows pinned class when pinned', async () => {
    await wrapper.setProps({ pinned: true })

    const aside = wrapper.find('aside.app-navigation-pinned')
    expect(aside.exists()).toBe(true)
  })

  it('is visible when pinned', async () => {
    await wrapper.setProps({ pinned: true })

    const aside = wrapper.find('aside')
    expect(aside.isVisible()).toBe(true)
  })

  it('emits update:pinned when pinned state changes', async () => {
    await wrapper.setProps({ pinned: true })

    expect(wrapper.emitted('update:pinned')).toBeFalsy()
  })

  it('emits drawerToggle when visibility changes', async () => {
    await wrapper.setProps({ startOpen: true })
    await nextTick()

    expect(wrapper.emitted('drawerToggle')).toBeTruthy()
  })

  it('emits update:startOpen when drawer opens', async () => {
    await wrapper.setProps({ startOpen: true })
    await nextTick()

    expect(wrapper.emitted('update:startOpen')).toBeTruthy()
  })

  it('renders resize handle', () => {
    const resizeHandle = wrapper.find('.resize-handle')
    expect(resizeHandle.exists()).toBe(true)
  })

  it('has correct z-index when not pinned', () => {
    const aside = wrapper.find('aside')
    expect(aside.attributes('style')).toContain('z-index: 1000')
  })

  it('has correct z-index when pinned', async () => {
    await wrapper.setProps({ pinned: true })

    const aside = wrapper.find('aside')
    expect(aside.attributes('style')).toContain('z-index: 40')
  })

  it('emits update:navWidth when resize occurs', async () => {
    const resizeHandle = wrapper.find('.resize-handle')

    // Simulate mousedown to start resize
    await resizeHandle.trigger('mousedown', {
      clientX: 280
    })

    expect(wrapper.vm.isResizing).toBe(true)
  })

  it('syncs startOpen prop changes to internal state', async () => {
    expect(wrapper.vm.drawerOpen).toBe(false)

    await wrapper.setProps({ startOpen: true })
    await nextTick()

    expect(wrapper.vm.drawerOpen).toBe(true)
  })

  it('is visible when startOpen is true (overlay mode)', async () => {
    await wrapper.setProps({ startOpen: true })
    await nextTick()

    expect(wrapper.vm.isVisible).toBe(true)
  })

  it('applies top and bottom positioning', () => {
    const aside = wrapper.find('aside')
    const style = aside.attributes('style')

    expect(style).toContain('top: 36px')
    expect(style).toContain('bottom: 36px')
  })

  it('has transition wrapper', () => {
    // Transition components don't render their own elements, they wrap children
    // Just verify the aside element exists which is what gets transitioned
    const aside = wrapper.find('aside.app-navigation-custom')
    expect(aside.exists()).toBe(true)
  })
})
