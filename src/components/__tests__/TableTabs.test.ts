import { mount } from '@vue/test-utils'
import TableTabsComponent from '../TableTabs.vue'
import type { TableTabsProps } from '../../models/componentProps/TableTabsProps'
import { describe, expect, it } from 'vitest'

describe('TableTabsComponent', () => {
  it('renders the correct label on each tab button', () => {
    const props: TableTabsProps = {
      id: 'testTabSet',
      tabs: [
        { id: 'tab1', label: 'Tab One', table: undefined },
        { id: 'tab2', label: 'Tab Two', table: undefined },
        { id: 'tab3', label: 'Tab Three', table: undefined }
      ]
    }

    const wrapper = mount(TableTabsComponent, { props })

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

    const wrapper = mount(TableTabsComponent, { props })

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

    const wrapper = mount(TableTabsComponent, { props })

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

  it('associates tabs and panels correctly using aria-controls and id', () => {
    const props: TableTabsProps = {
      id: 'testTabSet',
      tabs: [
        { id: 'tab1', label: 'Tab One', table: undefined },
        { id: 'tab2', label: 'Tab Two', table: undefined }
      ]
    }

    const wrapper = mount(TableTabsComponent, { props })
    const tabButtons = wrapper.findAll('button.p-tab')
    const tabPanels = wrapper.findAll('.p-tabpanel')

    // Check the association between aria-controls and id
    expect(tabButtons[0].attributes('aria-controls')).toContain('tabpanel_' + props.tabs[0].id)
    expect(tabPanels[0].attributes('id')).toContain('tabpanel_' + props.tabs[0].id)
  })

  it('renders nothing when tabs array is empty', () => {
    const props: TableTabsProps = { id: 'testTabSet', tabs: [] }
    const wrapper = mount(TableTabsComponent, { props })

    expect(wrapper.findAll('button.p-tab').length).toBe(0)
    expect(wrapper.findAll('.p-tabpanel').length).toBe(0)
  })

  it('updates rendered tabs when props change', async () => {
    const props: TableTabsProps = {
      id: 'testTabSet',
      tabs: [{ id: 'tab1', label: 'Tab One', table: undefined }]
    }

    const wrapper = mount(TableTabsComponent, { props })

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
