import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

const { MockDialog } = vi.hoisted(() => {
  const { defineComponent: dc, h: hFn } = require('vue')
  return {
    MockDialog: dc({
      name: 'Dialog',
      props: ['closable', 'dismissableMask', 'draggable', 'header', 'visible', 'modal', 'class'],
      setup(props: any, { slots }: any) {
        return () =>
          hFn(
            'div',
            {
              class: ['mock-dialog', ...(Array.isArray(props.class) ? props.class : [props.class])],
              'data-visible': props.visible,
              'data-header': props.header
            },
            [slots.default?.(), slots.footer?.()]
          )
      }
    })
  }
})

vi.mock('primevue/button', () => ({
  default: defineComponent({
    name: 'Button',
    props: {
      label: String,
      type: String,
      outlined: { type: Boolean, default: false }
    },
    emits: ['click'],
    setup(props, { emit }) {
      return () =>
        h(
          'button',
          {
            class: ['mock-button', { outlined: props.outlined }],
            'data-label': props.label,
            onClick: () => emit('click')
          },
          props.label
        )
    }
  })
}))

vi.mock('primevue/dialog', () => ({ default: MockDialog }))
vi.mock('primevue/divider', () => ({
  default: defineComponent({
    name: 'Divider',
    setup() {
      return () => h('hr', { class: 'mock-divider' })
    }
  })
}))

import VuescapeDialog from '../VuescapeDialog.vue'

describe('VuescapeDialog.vue', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(VuescapeDialog, {
      props: {
        modelValue: true,
        headerText: 'Test Dialog',
        closable: true,
        draggable: true,
        okButtonText: 'OK',
        showFooter: true
      }
    })
  })

  it('renders correctly with props', () => {
    const dialog = wrapper.find('.mock-dialog')
    expect(dialog.exists()).toBe(true)
    expect(dialog.attributes('data-header')).toBe('Test Dialog')
    expect(dialog.attributes('data-visible')).toBe('true')
  })

  it('respects closable and draggable props', () => {
    expect(wrapper.props('closable')).toBe(true)
    expect(wrapper.props('draggable')).toBe(true)
  })

  describe('okClick', () => {
    it('emits confirm event', async () => {
      await wrapper.vm.okClick()
      expect(wrapper.emitted('confirm')).toHaveLength(1)
    })

    it('emits update:modelValue with false', async () => {
      await wrapper.vm.okClick()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
    })

    it('emits confirm before update:modelValue', async () => {
      await wrapper.vm.okClick()
      const emittedEvents = Object.keys(wrapper.emitted())
      const confirmIndex = emittedEvents.indexOf('confirm')
      const updateIndex = emittedEvents.indexOf('update:modelValue')
      expect(confirmIndex).toBeLessThan(updateIndex)
    })
  })

  describe('cancelClick', () => {
    it('emits update:modelValue with false', async () => {
      await wrapper.vm.cancelClick()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
    })

    it('does not emit confirm', async () => {
      await wrapper.vm.cancelClick()
      expect(wrapper.emitted('confirm')).toBeUndefined()
    })
  })

  describe('cancel button', () => {
    it('does not render cancel button when cancelButtonText is not provided', () => {
      const buttons = wrapper.findAll('.mock-button')
      expect(buttons).toHaveLength(1)
      expect(buttons[0].attributes('data-label')).toBe('OK')
    })

    it('renders cancel button when cancelButtonText is provided', () => {
      const wrapperWithCancel = mount(VuescapeDialog, {
        props: {
          modelValue: true,
          headerText: 'Test',
          cancelButtonText: 'Cancel'
        }
      })
      const buttons = wrapperWithCancel.findAll('.mock-button')
      expect(buttons).toHaveLength(2)
      expect(buttons[0].attributes('data-label')).toBe('Cancel')
      expect(buttons[1].attributes('data-label')).toBe('OK')
    })

    it('renders cancel button as outlined', () => {
      const wrapperWithCancel = mount(VuescapeDialog, {
        props: {
          modelValue: true,
          headerText: 'Test',
          cancelButtonText: 'Cancel'
        }
      })
      const cancelButton = wrapperWithCancel.findAll('.mock-button')[0]
      expect(cancelButton.classes()).toContain('outlined')
    })

    it('OK button is not outlined', () => {
      const wrapperWithCancel = mount(VuescapeDialog, {
        props: {
          modelValue: true,
          headerText: 'Test',
          cancelButtonText: 'Cancel'
        }
      })
      const okButton = wrapperWithCancel.findAll('.mock-button')[1]
      expect(okButton.classes()).not.toContain('outlined')
    })
  })

  describe('density', () => {
    it('defaults to comfortable density', () => {
      expect(wrapper.props('density')).toBe('comfortable')
    })

    it('does not apply compact class for comfortable density', () => {
      const html = wrapper.html()
      expect(html).not.toContain('vuescape-dialog--compact')
    })

    it('applies compact class when density is compact', () => {
      const compactWrapper = mount(VuescapeDialog, {
        props: {
          modelValue: true,
          headerText: 'Test',
          density: 'compact'
        }
      })
      const html = compactWrapper.html()
      expect(html).toContain('vuescape-dialog--compact')
    })

    it('always applies base dialog class', () => {
      const html = wrapper.html()
      expect(html).toContain('vuescape-dialog__pv-dialog-header--color')
    })
  })

  describe('footer visibility', () => {
    it('renders footer when showFooter is true', () => {
      const buttons = wrapper.findAll('.mock-button')
      expect(buttons.length).toBeGreaterThan(0)
      expect(wrapper.find('.mock-divider').exists()).toBe(true)
    })

    it('does not render footer when showFooter is false', () => {
      const noFooterWrapper = mount(VuescapeDialog, {
        props: {
          modelValue: true,
          headerText: 'Test',
          showFooter: false
        }
      })
      expect(noFooterWrapper.findAll('.mock-button')).toHaveLength(0)
      expect(noFooterWrapper.find('.mock-divider').exists()).toBe(false)
    })
  })

  describe('default prop values', () => {
    it('defaults closable to false', () => {
      const defaultWrapper = mount(VuescapeDialog, {
        props: {
          modelValue: true,
          headerText: 'Test'
        }
      })
      expect(defaultWrapper.props('closable')).toBe(false)
    })

    it('defaults okButtonText to OK', () => {
      const defaultWrapper = mount(VuescapeDialog, {
        props: {
          modelValue: true,
          headerText: 'Test'
        }
      })
      const okButton = defaultWrapper.find('.mock-button')
      expect(okButton.attributes('data-label')).toBe('OK')
    })

    it('defaults density to comfortable', () => {
      const defaultWrapper = mount(VuescapeDialog, {
        props: {
          modelValue: true,
          headerText: 'Test'
        }
      })
      expect(defaultWrapper.props('density')).toBe('comfortable')
    })
  })
})
