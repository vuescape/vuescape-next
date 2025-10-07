import { ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, it, expect, vi } from 'vitest'

import ChicletButton from '../../components/ChicletButton.vue'
import type { Chiclet } from '../../models/Chiclet'
import type { NavigationActionPayload } from '../../models/dynamic-ui/actions/NavigationActionPayload'
import { LinkTarget } from '../../reporting-domain/Link/LinkTarget'
import { useActionStore } from '../../stores/useActionStore'
import { ReportPaneKind } from '../../models/feature/ReportPaneKind'

describe('ChicletButton.vue', () => {
  let actionStore: ReturnType<typeof useActionStore>
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = setActivePinia(createPinia())
    actionStore = useActionStore()
  })

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

  it('click handler is invoked when clicked on', async () => {
    const wrapper = mount(ChicletButton, {
      props: { chiclet: chiclet.value },
      global: {
        plugins: [pinia]
      }
    })

    const mockPaneElement = document.createElement('div')
    mockPaneElement.setAttribute('data-panekind', ReportPaneKind.LeftPane)
    const buttonElement = wrapper.find('.chiclet-button__layout')
    buttonElement.element.closest = vi.fn(() => mockPaneElement) // Mock closest to return the mock pane element

    await buttonElement.trigger('click')

    expect(actionStore.action.typeName).toBe('action.navigate')
    const payload = actionStore.action.payload as NavigationActionPayload
    expect(payload.url).toBe(chiclet.value.action.payload.url)
    expect(payload.target).toBe(LinkTarget.NewWindow)
    expect(actionStore.paneKind).toBe(ReportPaneKind.LeftPane)
  })

  it('does not render button when isVisible is false', () => {
    chiclet.value.isVisible = false
    const wrapper = mount(ChicletButton, {
      props: { chiclet: chiclet.value }
    })
    expect(wrapper.find('.chiclet-button__layout').exists()).toBe(false)
  })
})

const chiclet = ref<Chiclet>({
  isVisible: true,
  icons: ['pi pi-check'],
  cssClass: 'custom-class',
  action: {
    typeName: 'action.navigate',
    payload: {
      url: 'http://example.com',
      target: LinkTarget.NewWindow
    }
  },
  id: 'id-value',
  title: 'Example Site'
})
