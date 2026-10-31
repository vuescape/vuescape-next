import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CustomLoading from '../CustomLoading.vue'

const createWrapper = (isVisible: boolean) => {
  const result = mount(CustomLoading, {
    props: {
      isVisible: isVisible,
    },
  })

  return result
}

describe('CustomLoading.vue', () => {
  it('does not render with default props', () => {
    const wrapper = createWrapper(false)
    const componentHtml = wrapper.html()
    expect(componentHtml).not.toContain('class="custom-loading-wrapper"')
  })

  it('renders when isVisible is true', () => {
    const wrapper = createWrapper(true)
    const componentHtml = wrapper.html()
    expect(componentHtml).toContain('class="custom-loading-wrapper"')
  })

  it('hides loading when set to false', async () => {
    const wrapper = createWrapper(true)
    expect(wrapper.html()).toContain('class="custom-loading-wrapper"')
    await wrapper.setProps({ isVisible: false })
    expect(wrapper.html()).not.toContain('class="custom-loading-wrapper"')
  })

  it('should stay beneath dialogs unless asked to cover them', async () => {
    // Arrange
    const wrapper = createWrapper(true)
    expect(wrapper.find('.custom-loading-wrapper--cover-dialogs').exists()).toBe(false)

    // Act
    await wrapper.setProps({ shouldCoverDialogs: true })

    // Assert
    expect(wrapper.find('.custom-loading-wrapper--cover-dialogs').exists()).toBe(true)
  })
})
