// @ts-nocheck
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import VuescapeDialog from '../VuescapeDialog.vue'

// Mock PrimeVue components
vi.mock('primevue/button', () => ({ default: 'Button' }))
vi.mock('primevue/dialog', () => ({ default: 'Dialog' }))
vi.mock('primevue/divider', () => ({ default: 'Divider' }))

describe('VuescapeDialog.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(VuescapeDialog, {
      props: {
        modelValue: true,
        headerText: 'Test Dialog',
        closable: true,
        draggable: true,
        okButtonText: 'OK',
        showFooter: true,
      },
    })
  })

  it('renders correctly with default props', () => {
    const componentHtml = wrapper.html()
    expect(componentHtml).toContain('header="Test Dialog"')
    expect(componentHtml).toContain('visible="true"')
    expect(componentHtml).toContain('closable="true"')
    expect(componentHtml).toContain('draggable="true"')
  })

  it('emits update:visible event with false on okClick', async () => {
    await wrapper.vm.okClick()
    expect(wrapper.emitted()['update:visible'][0]).toEqual([false])
  })

  it('respects closable and draggable props', () => {
    expect(wrapper.props('closable')).toBe(true)
    expect(wrapper.props('draggable')).toBe(true)
  })
})
