import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import type { TableTabsProps } from '../../models/componentProps/TableTabsProps'
import TableTabsComponent from '../TableTabs.vue'

import PrimeVue from 'primevue/config'

const primeVuePlugin: [any, any] = [
  PrimeVue,
  {
    ripple: false,
    // minimal locale so TabList can read aria labels safely
    locale: { aria: { next: 'Next', previous: 'Previous' } }
  }
]

// Stub ResizeObserver locally for this test file.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!(global as any).ResizeObserver) {
  ;(global as any).ResizeObserver = ResizeObserverStub
}
if (!(global as any).IntersectionObserver) {
  ;(global as any).IntersectionObserver = IntersectionObserverStub
}

const createWrapper = (props: TableTabsProps) => {
  return mount(TableTabsComponent, {
    props,
    global: {
      plugins: [primeVuePlugin],
      // optional but nice: stub transitions to reduce flakiness
      stubs: { transition: false, 'transition-group': false }
    }
  })
}

// NOTE: This mocks PrimeVue’s internal layout calc to avoid test flakiness.
// e.g. getOuterWidth can be called async after test is completed giving a reference error.
// Be aware: tightly coupled to PrimeVue v4.3 implementation details.
// If tabs break after upgrade, re-evaluate this.
vi.mock('@primeuix/src/dom/methods/getOuterWidth', () => ({
  getOuterWidth: () => 100 // or a reasonable fixed value
}))

describe('TableTabsComponent', () => {
  it('renders the correct label on each tab button', async () => {
    const props: TableTabsProps = {
      id: 'testTabSet',
      tabs: [
        { id: 'tab1', label: 'Tab One', table: undefined },
        { id: 'tab2', label: 'Tab Two', table: undefined },
        { id: 'tab3', label: 'Tab Three', table: undefined }
      ]
    }

    const wrapper = createWrapper(props)
    await flushPromises()
    await nextTick()

    // Find all tab buttons
    const tabButtons = wrapper.findAll('button.p-tab')
    expect(tabButtons.length).toBe(props.tabs.length)

    // Check that each button text matches the corresponding label.
    props.tabs.forEach((tab, index) => {
      expect(tabButtons[index].text()).toBe(tab.label)
    })
  })

  it('sets aria-selected="true" on the active tab and "false" on others', async () => {
    const props: TableTabsProps = {
      id: 'testTabSet',
      tabs: [
        { id: 'tab1', label: 'Tab One', table: undefined },
        { id: 'tab2', label: 'Tab Two', table: undefined }
      ]
    }

    const wrapper = createWrapper(props)
    await flushPromises()
    await nextTick()

    const tabButtons = wrapper.findAll('button.p-tab')

    expect(tabButtons[0].attributes('aria-selected')).toBe('true')
    expect(tabButtons[1].attributes('aria-selected')).toBe('false')

    // Click on the second tab
    await tabButtons[1].trigger('click')

    // Verify aria-selected updates correctly
    expect(tabButtons[0].attributes('aria-selected')).toBe('false')
    expect(tabButtons[1].attributes('aria-selected')).toBe('true')
  })

  it('only displays the active tab panel', async () => {
    const props: TableTabsProps = {
      id: 'testTabSet',
      tabs: [
        { id: 'tab1', label: 'Tab One', table: undefined },
        { id: 'tab2', label: 'Tab Two', table: undefined },
        { id: 'tab3', label: 'Tab Three', table: undefined }
      ]
    }

    const wrapper = createWrapper(props)
    await flushPromises()
    await nextTick()

    const tabPanels1 = wrapper.findAll('.p-tabpanel')
    expect(tabPanels1.length).toBe(1)
    expect(tabPanels1[0].html()).toContain('tab_tab1')

    // Click on the second tab
    const tabButtons = wrapper.findAll('button.p-tab')
    await tabButtons[1].trigger('click')

    // Verify the second panel is visible
    const tabPanels2 = wrapper.findAll('.p-tabpanel')
    expect(tabPanels2.length).toBe(1)
    expect(tabPanels2[0].html()).toContain('tab_tab2')
  })

  it('associates tabs and panels correctly using aria-controls and id', async () => {
    const props: TableTabsProps = {
      id: 'testTabSet',
      tabs: [
        { id: 'tab1', label: 'Tab One', table: undefined },
        { id: 'tab2', label: 'Tab Two', table: undefined }
      ]
    }

    const wrapper = createWrapper(props)
    await flushPromises()
    await nextTick()

    const tabButtons = wrapper.findAll('button.p-tab')
    const tabPanels = wrapper.findAll('.p-tabpanel')

    // Check the association between aria-controls and id
    expect(tabButtons[0].attributes('aria-controls')).toContain('tabpanel_' + props.tabs[0].id)
    expect(tabPanels[0].attributes('id')).toContain('tabpanel_' + props.tabs[0].id)
  })

  it('renders nothing when tabs array is empty', async () => {
    const props: TableTabsProps = { id: 'testTabSet', tabs: [] }
    const wrapper = createWrapper(props)
    await nextTick()

    expect(wrapper.findAll('button.p-tab').length).toBe(0)
    expect(wrapper.findAll('.p-tabpanel').length).toBe(0)
  })

  it('updates rendered tabs when props change', async () => {
    const props: TableTabsProps = {
      id: 'testTabSet',
      tabs: [{ id: 'tab1', label: 'Tab One', table: undefined }]
    }

    const wrapper = createWrapper(props)
    await flushPromises()
    await nextTick()

    // Initially, only one tab is rendered
    expect(wrapper.findAll('button.p-tab').length).toBe(1)

    // Update props to add a new tab
    await wrapper.setProps({
      tabs: [
        { id: 'tab1', label: 'Tab One', table: undefined },
        { id: 'tab2', label: 'Tab Two', table: undefined }
      ]
    })

    // Verify two tabs are now rendered
    expect(wrapper.findAll('button.p-tab').length).toBe(2)
  })
})
