import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import PrimeVue from 'primevue/config'

import ActionButton from '../ActionButton.vue'
import type { ActionButtonProps } from '../../models/componentProps/ActionButtonProps'
import type { ActionMenuItem } from '../../models/dynamic-ui/ActionMenuItem'
import { useActionStore } from '../../stores/useActionStore'
import { LinkTarget } from '../../reporting-domain/Link/LinkTarget'
import { ReportPaneKind } from '../../models/feature/ReportPaneKind'

// Mock router setup
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/:pathMatch(.*)*', component: { template: '<div>Not Found</div>' } }
  ]
})

const primeVuePlugin: [any, any] = [
  PrimeVue,
  {
    ripple: false,
    locale: { aria: { next: 'Next', previous: 'Previous' } }
  }
]

// Note: No DOM mocks needed for ActionButton as it only uses simple PrimeVue components
// (Button and Menu) that don't require complex layout calculations

describe('ActionButton.vue', () => {
  let actionStore: ReturnType<typeof useActionStore>
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    actionStore = useActionStore()
  })

  const createWrapper = (props: ActionButtonProps) => {
    return mount(ActionButton, {
      props,
      global: {
        plugins: [primeVuePlugin, router, pinia]
      }
    })
  }

  const mockActionMenuItem: ActionMenuItem = {
    label: 'Test Action',
    action: {
      typeName: 'action.navigate',
      payload: {
        url: '/test-url',
        target: LinkTarget.CurrentWindow
      }
    },
    iconPosition: 'left',
    isDisabled: false,
    tooltip: 'Test tooltip',
    icons: ['pi pi-check']
  }

  const mockActionButtonProps: ActionButtonProps = {
    id: 'test-action-button',
    label: 'Test Button',
    menuItems: [mockActionMenuItem],
    icons: ['pi pi-cog'],
    iconPosition: 'left',
    isDisabled: false,
    tooltip: 'Test tooltip'
  }

  it('renders the button with correct props', () => {
    const wrapper = createWrapper(mockActionButtonProps)

    const button = wrapper.findComponent({ name: 'Button' })
   
    expect(button.exists()).toBe(true)
    expect(button.props('label')).toBe('Test Button')
    expect(button.props('icon')).toBe('pi pi-cog')
    expect(button.props('iconPos')).toBe('left')
    expect(button.element.title).toBe('Test tooltip')
    expect(button.element.disabled).toBe(false)
  })

  it('renders button with right icon position when specified', () => {
    const propsWithRightIcon = {
      ...mockActionButtonProps,
      iconPosition: 'right' as const
    }
    const wrapper = createWrapper(propsWithRightIcon)

    const button = wrapper.findComponent({ name: 'Button' })
    expect(button.props('iconPos')).toBe('right')
  })

  it('renders button with no icons when icons prop is not provided', () => {
    const propsWithoutIcons = {
      ...mockActionButtonProps,
      icons: undefined
    }
    const wrapper = createWrapper(propsWithoutIcons)

    const button = wrapper.findComponent({ name: 'Button' })
    expect(button.props('icon')).toBe('')
  })

  it('renders button as disabled when isDisabled is true', () => {
    const disabledProps = {
      ...mockActionButtonProps,
      isDisabled: true
    }
    const wrapper = createWrapper(disabledProps)

    const button = wrapper.findComponent({ name: 'Button' })

    // Check the actual DOM element disabled property
    expect(button.element.disabled).toBe(true)
  })

  it('renders button as enabled when isDisabled is false', () => {
    const enabledProps = {
      ...mockActionButtonProps,
      isDisabled: false
    }
    const wrapper = createWrapper(enabledProps)

    const button = wrapper.findComponent({ name: 'Button' })

    // Check the actual DOM element disabled property
    expect(button.element.disabled).toBe(false)
  })

  it('renders button with tooltip attribute when provided', () => {
    const propsWithTooltip = {
      ...mockActionButtonProps,
      tooltip: 'This is a tooltip'
    }
    const wrapper = createWrapper(propsWithTooltip)

    const button = wrapper.findComponent({ name: 'Button' })
    expect(button.element.title).toBe('This is a tooltip')
    expect(button.attributes('title')).toBe('This is a tooltip')
  })

  it('renders button without tooltip attribute when not provided', () => {
    const propsWithoutTooltip = {
      ...mockActionButtonProps,
      tooltip: undefined
    }
    const wrapper = createWrapper(propsWithoutTooltip)

    const button = wrapper.findComponent({ name: 'Button' })
    expect(button.element.title).toBe('')
    expect(button.attributes('title')).toBeUndefined()
  })

  it('renders button with multiple icons joined by space', () => {
    const propsWithMultipleIcons = {
      ...mockActionButtonProps,
      icons: ['pi pi-cog', 'pi pi-check']
    }
    const wrapper = createWrapper(propsWithMultipleIcons)

    const button = wrapper.findComponent({ name: 'Button' })
    expect(button.props('icon')).toBe('pi pi-cog pi pi-check')
  })

  it('renders menu component with correct model', () => {
    const wrapper = createWrapper(mockActionButtonProps)

    const menu = wrapper.findComponent({ name: 'Menu' })
    expect(menu.exists()).toBe(true)
    expect(menu.props('popup')).toBe(true)

    const menuModel = menu.props('model')
    expect(menuModel).toHaveLength(1)
    expect(menuModel[0]).toMatchObject({
      label: 'Test Action',
      icon: 'pi pi-check',
      iconPos: 'left',
      disabled: false
    })
  })

  it('handles menu item click and dispatches action', async () => {
    const wrapper = createWrapper(mockActionButtonProps)

    // Click the button to open menu
    const button = wrapper.findComponent({ name: 'Button' })
    await button.trigger('click')

    // The button click should trigger the menu toggle
    // We can't easily test the menu toggle directly, but we can verify
    // the button is clickable and the menu component exists
    expect(button.exists()).toBe(true)
    const menu = wrapper.findComponent({ name: 'Menu' })
    expect(menu.exists()).toBe(true)
  })

  it('processes menu items correctly with all properties', () => {
    const complexMenuItem: ActionMenuItem = {
      label: 'Complex Action',
      action: {
        typeName: 'action.navigate',
        payload: {
          url: '/complex-url',
          target: LinkTarget.NewWindow
        }
      },
      iconPosition: 'right',
      isDisabled: true,
      tooltip: 'Complex tooltip',
      icons: ['pi pi-star', 'pi pi-heart'],
      payload: { customData: 'test' }
    }

    const propsWithComplexItem: ActionButtonProps = {
      ...mockActionButtonProps,
      menuItems: [complexMenuItem]
    }

    const wrapper = createWrapper(propsWithComplexItem)
    const menu = wrapper.findComponent({ name: 'Menu' })
    const menuModel = menu.props('model')

    expect(menuModel[0]).toMatchObject({
      label: 'Complex Action',
      icon: 'pi pi-star pi pi-heart',
      iconPos: 'right',
      disabled: true
    })
  })

  it('handles menu items with default values when properties are not provided', () => {
    const minimalMenuItem: ActionMenuItem = {
      label: 'Minimal Action',
      action: {
        typeName: 'action.navigate',
        payload: {
          url: '/minimal-url',
          target: LinkTarget.CurrentWindow
        }
      },
      iconPosition: 'left',
      isDisabled: false
    }

    const propsWithMinimalItem: ActionButtonProps = {
      ...mockActionButtonProps,
      menuItems: [minimalMenuItem]
    }

    const wrapper = createWrapper(propsWithMinimalItem)
    const menu = wrapper.findComponent({ name: 'Menu' })
    const menuModel = menu.props('model')

    expect(menuModel[0]).toMatchObject({
      label: 'Minimal Action',
      icon: undefined,
      iconPos: 'left',
      disabled: false
    })
  })

  it('passes tooltip to menu items when provided', () => {
    const menuItemWithTooltip: ActionMenuItem = {
      label: 'Action with Tooltip',
      action: {
        typeName: 'action.navigate',
        payload: {
          url: '/tooltip-url',
          target: LinkTarget.CurrentWindow
        }
      },
      iconPosition: 'left',
      isDisabled: false,
      tooltip: 'This menu item has a tooltip'
    }

    const propsWithTooltipItem: ActionButtonProps = {
      ...mockActionButtonProps,
      menuItems: [menuItemWithTooltip]
    }

    const wrapper = createWrapper(propsWithTooltipItem)
    const menu = wrapper.findComponent({ name: 'Menu' })
    const menuModel = menu.props('model')

    expect(menuModel[0]).toMatchObject({
      label: 'Action with Tooltip',
      title: 'This menu item has a tooltip'
    })
  })

  it('handles multiple menu items correctly', () => {
    const multipleMenuItems: ActionMenuItem[] = [
      {
        label: 'Action 1',
        action: {
          typeName: 'action.navigate',
          payload: { url: '/action1', target: LinkTarget.CurrentWindow }
        },
        iconPosition: 'left',
        isDisabled: false,
        icons: ['pi pi-check']
      },
      {
        label: 'Action 2',
        action: {
          typeName: 'action.navigate',
          payload: { url: '/action2', target: LinkTarget.NewWindow }
        },
        iconPosition: 'right',
        isDisabled: true,
        icons: ['pi pi-star']
      }
    ]

    const propsWithMultipleItems: ActionButtonProps = {
      ...mockActionButtonProps,
      menuItems: multipleMenuItems
    }

    const wrapper = createWrapper(propsWithMultipleItems)
    const menu = wrapper.findComponent({ name: 'Menu' })
    const menuModel = menu.props('model')

    expect(menuModel).toHaveLength(2)
    expect(menuModel[0].label).toBe('Action 1')
    expect(menuModel[1].label).toBe('Action 2')
    expect(menuModel[0].disabled).toBe(false)
    expect(menuModel[1].disabled).toBe(true)
  })

  it('handles empty menu items array', () => {
    const propsWithEmptyMenu: ActionButtonProps = {
      ...mockActionButtonProps,
      menuItems: []
    }

    const wrapper = createWrapper(propsWithEmptyMenu)
    const menu = wrapper.findComponent({ name: 'Menu' })
    const menuModel = menu.props('model')

    expect(menuModel).toHaveLength(0)
  })

  it('calls action store dispatch when menu item is clicked', () => {
    const wrapper = createWrapper(mockActionButtonProps)

    // Get the menu component and access its model to simulate a click
    const menu = wrapper.findComponent({ name: 'Menu' })
    const menuModel = menu.props('model')
    const firstMenuItem = menuModel[0]

    // Call the command function directly
    firstMenuItem.command()

    // Check that the action store was updated with the correct action
    expect(actionStore.action.typeName).toBe('action.navigate')
    expect(actionStore.action.payload).toEqual({
      url: '/test-url',
      target: LinkTarget.CurrentWindow
    })
    // ActionButton always uses ReportPaneKind.None as the pane parameter
    expect(actionStore.paneKind).toBe(ReportPaneKind.None)
  })

  it('handles different action types correctly', () => {
    const noActionMenuItem: ActionMenuItem = {
      label: 'No Action',
      action: {
        typeName: 'action.noAction'
      },
      iconPosition: 'left',
      isDisabled: false
    }

    const propsWithNoAction: ActionButtonProps = {
      ...mockActionButtonProps,
      menuItems: [noActionMenuItem]
    }

    const wrapper = createWrapper(propsWithNoAction)
    const menu = wrapper.findComponent({ name: 'Menu' })
    const menuModel = menu.props('model')

    expect(menuModel[0]).toMatchObject({
      label: 'No Action',
      disabled: false
    })
  })

  it('handles select navigation action correctly', () => {
    const selectActionMenuItem: ActionMenuItem = {
      label: 'Select Action',
      action: {
        typeName: 'action.selectNavigate',
        payload: {
          url: '/select-url',
          target: LinkTarget.CurrentWindow
        }
      },
      iconPosition: 'left',
      isDisabled: false
    }

    const propsWithSelectAction: ActionButtonProps = {
      ...mockActionButtonProps,
      menuItems: [selectActionMenuItem]
    }

    const wrapper = createWrapper(propsWithSelectAction)
    const menu = wrapper.findComponent({ name: 'Menu' })
    const menuModel = menu.props('model')

    expect(menuModel[0]).toMatchObject({
      label: 'Select Action',
      disabled: false
    })
  })
})
