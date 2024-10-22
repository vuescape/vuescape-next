import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import ChicletButton from '../ChicletButton.vue'
import type { Chiclet } from '../../models/dynamic-ui/'

const chiclet = ref<Chiclet>({
  isVisible: true,
  icons: ['pi pi-check'],
  cssClass: 'custom-class',
  action: {
    type: 'navigate',
    payload: {
      url: 'http://example.com',
      target: '_blank'
    }
  },
  id: 'id-value',
  title: 'Example Site'
})

describe('ChicletButton.vue', () => {
  it('renders the button with correct props', () => {
    const wrapper = mount(ChicletButton, {
      props: { chiclet: chiclet.value }
    })
    const iconClasses = wrapper.find('.chiclet-button__icon').classes()
    expect(iconClasses).toContain('pi-check')
    expect(iconClasses).toContain('pi')
    expect(wrapper.find('.chiclet-button__layout').exists()).toBe(true)
    expect(wrapper.find('.chiclet-button__icon').exists()).toBe(true)
    expect(wrapper.find('.chiclet-button__layout').classes()).toContain('custom-class')
  })

  it('handles navigate action correctly', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {
      return null // or you can return a mock Window object if needed
    })
    const wrapper = mount(ChicletButton, {
      props: { chiclet: chiclet.value }
    })
    await wrapper.find('.chiclet-button__layout').trigger('click')
    expect(openSpy).toHaveBeenCalledWith('http://example.com', '_blank')
    openSpy.mockRestore()
  })

  it('does not render button when isVisible is false', () => {
    chiclet.value.isVisible = false
    const wrapper = mount(ChicletButton, {
      props: { chiclet: chiclet.value }
    })
    expect(wrapper.find('.chiclet-button__layout').exists()).toBe(false)
  })
})
