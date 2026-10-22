import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { beforeEach, describe, expect, it } from 'vitest'

import ButtonComponentRenderer from '../ButtonComponentRenderer.vue'
import type { ButtonComponentPayload } from '../../models/dynamic-ui/pane-components/ButtonComponentPayload'
import { ReportPaneKind } from '../../models/feature/ReportPaneKind'
import { LinkTarget } from '../../reporting-domain/Link/LinkTarget'
import { useActionStore } from '../../stores/useActionStore'

describe('ButtonComponentRenderer.vue', () => {
  let pinia: ReturnType<typeof createPinia>
  let actionStore: ReturnType<typeof useActionStore>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    actionStore = useActionStore()
  })

  const payload: ButtonComponentPayload = {
    id: 'view-button',
    label: 'View',
    action: {
      typeName: 'action.navigate',
      payload: { url: '/my-data/dataset/d1', target: LinkTarget.NewWindow }
    },
    icons: ['fad', 'fa-eye'],
    isDisabled: false,
    tooltip: 'View this submission'
  }

  const createWrapper = (props: ButtonComponentPayload) =>
    mount(ButtonComponentRenderer, {
      props,
      global: { plugins: [[PrimeVue, { ripple: false }], pinia] }
    })

  it('should render the label, the joined icons, and the tooltip', () => {
    // Act
    const wrapper = createWrapper(payload)

    // Assert
    const button = wrapper.findComponent({ name: 'Button' })
    expect(button.props('label')).toBe('View')
    expect(button.props('icon')).toBe('fad fa-eye')
    expect(wrapper.find('button').element.disabled).toBe(false)
    expect(wrapper.attributes('title')).toBe('View this submission')
  })

  it('should dispatch its action when clicked', async () => {
    // Arrange
    const wrapper = createWrapper(payload)

    // Act
    await wrapper.find('button').trigger('click')

    // Assert
    expect(actionStore.action).toEqual(payload.action)
    expect(actionStore.paneKind).toBe(ReportPaneKind.None)
  })

  it('should be disabled, and not dispatch, when isDisabled', async () => {
    // Arrange
    const wrapper = createWrapper({ ...payload, isDisabled: true })

    // Act
    await wrapper.find('button').trigger('click')

    // Assert
    expect(wrapper.find('button').element.disabled).toBe(true)
    expect(actionStore.action).not.toEqual(payload.action)
  })

  it('should render without icons, disabled state, or tooltip when they are absent', () => {
    // Act
    const wrapper = createWrapper({ id: 'b', label: 'Go', action: payload.action })

    // Assert
    expect(wrapper.find('.p-button-icon').exists()).toBe(false)
    expect(wrapper.find('button').element.disabled).toBe(false)
    expect(wrapper.attributes('title')).toBeUndefined()
  })
})
