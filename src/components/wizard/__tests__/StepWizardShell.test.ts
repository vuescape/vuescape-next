import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import StepWizardShell from '../../wizard/StepWizardShell.vue'
import VuescapeButton from '../../VuescapeButton.vue'
import { ref, defineComponent, markRaw, computed } from 'vue'
import type { WizardButtonConfig } from '../../../models/wizard/ButtonConfig'

// Mock step component for testing
const DummyStep = markRaw(defineComponent({
  props: ['foo'],
  emits: ['update', 'can-continue'],
  template: `<div data-testid="dummy-step">{{ foo }}</div>`
}))

function createEngineMock({ isLastStep = false, historyLength = 2, buttonConfig = undefined }: { isLastStep?: boolean, historyLength?: number, buttonConfig?: WizardButtonConfig } = {}) {
  return {
    currentNode: computed(() => ({
      id: 'step-1',
      component: DummyStep,
      props: { foo: 'bar' },
      hash: undefined,
      buttonConfig,
      next: () => null
    })),
    props: ref({ foo: 'bar' }),
    currentStepId: ref('step-1'),
    isLastStep: ref(isLastStep),
    context: {
      state: { some: 'state' },
      history: Array(historyLength).fill('step')
    },
    goNext: vi.fn(),
    goBack: vi.fn(),
    updateStepState: vi.fn()
  }
}

describe('StepWizardShell', () => {
  it('renders title if provided', async () => {
    const engine = createEngineMock()
    const wrapper = mount(StepWizardShell, {
      props: {
        engine: engine as any,
        title: 'My Wizard'
      },
      global: {
        stubs: {
          VuescapeButton
        }
      }
    })
    await flushPromises()
    expect(wrapper.text()).toContain('My Wizard')
  })

  it('renders step component with correct props', async () => {
    const engine = createEngineMock()
    const wrapper = mount(StepWizardShell, {
      props: { engine: engine as any },
      global: {
        stubs: {
          VuescapeButton
        }
      }
    })
    await flushPromises()
    expect(wrapper.find('[data-testid="dummy-step"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="dummy-step"]').text()).toBe('bar')
  })

  it('emits update and calls engine.updateStepState on step update', async () => {
    const engine = createEngineMock()
    const wrapper = mount(StepWizardShell, {
      props: { engine: engine as any },
      global: {
        stubs: {
          VuescapeButton
        }
      }
    })
    await flushPromises()
    await wrapper.findComponent(DummyStep).vm.$emit('update', { foo: 'baz' })
    expect(engine.updateStepState).toHaveBeenCalledWith('step-1', { foo: 'baz' })
    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('update')![0]).toEqual(['step-1', { foo: 'baz' }])
  })

  it('enables Next button only when canContinue is true', async () => {
    const engine = createEngineMock()
    const wrapper = mount(StepWizardShell, {
      props: { engine: engine as any },
      global: {
        stubs: {
          VuescapeButton
        }
      }
    })
    await flushPromises()
    // Initially disabled
    const nextBtn = wrapper.findAllComponents({ name: 'VuescapeButton' }).at(-1)!
    expect(nextBtn.props('disabled')).toBe(true)
    // Emit can-continue
    await wrapper.findComponent(DummyStep).vm.$emit('can-continue', true)
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents({ name: 'VuescapeButton' }).at(-1)!.props('disabled')).toBe(
      false
    )
  })

  it('calls engine.goNext or emits finished on Next button click', async () => {
    // Not last step
    const engine = createEngineMock({ isLastStep: false })
    const wrapper = mount(StepWizardShell, {
      props: { engine: engine as any },
      global: {
        stubs: {
          VuescapeButton
        }
      }
    })
    await flushPromises()
    await wrapper.findComponent(DummyStep).vm.$emit('can-continue', true)
    await wrapper.vm.$nextTick()
    await wrapper.findAllComponents({ name: 'VuescapeButton' }).at(-1)!.trigger('click')
    expect(engine.goNext).toHaveBeenCalled()

    // Last step
    const engine2 = createEngineMock({ isLastStep: true })
    const wrapper2 = mount(StepWizardShell, {
      props: { engine: engine2 as any },
      global: {
        stubs: {
          VuescapeButton
        }
      }
    })
    await flushPromises()
    await wrapper2.findComponent(DummyStep).vm.$emit('can-continue', true)
    await wrapper2.vm.$nextTick()
    await wrapper2.findAllComponents({ name: 'VuescapeButton' }).at(-1)!.trigger('click')
    expect(wrapper2.emitted('finished')).toBeTruthy()
    expect(wrapper2.emitted('finished')![0]).toEqual([{ some: 'state' }])
  })

  it('calls engine.goBack on Back button click', async () => {
    const engine = createEngineMock()
    const wrapper = mount(StepWizardShell, {
      props: { engine: engine as any },
      global: {
        stubs: {
          VuescapeButton
        }
      }
    })
    await flushPromises()
    await wrapper.findAllComponents({ name: 'VuescapeButton' }).at(0)!.trigger('click')
    expect(engine.goBack).toHaveBeenCalled()
  })

  it('disables Back and Cancel buttons if history length <= 1', async () => {
    const engine = createEngineMock({ historyLength: 1 })
    const wrapper = mount(StepWizardShell, {
      props: { engine: engine as any, shouldShowCancelButton: true },
      global: {
        stubs: {
          VuescapeButton
        }
      }
    })
    await flushPromises()
    const btns = wrapper.findAllComponents({ name: 'VuescapeButton' })
    // Back button
    expect(btns.at(0)!.props('disabled')).toBe(true)
  })

  it('shows Cancel button if shouldShowCancelButton is true and emits cancel', async () => {
    const engine = createEngineMock()
    const wrapper = mount(StepWizardShell, {
      props: { engine: engine as any, shouldShowCancelButton: true },
      global: {
        stubs: {
          VuescapeButton
        }
      }
    })
    await flushPromises()
    const cancelBtn = wrapper
      .findAllComponents({ name: 'VuescapeButton' })
      .find((btn) => btn.text() === 'Cancel')
    expect(cancelBtn).toBeTruthy()
    await cancelBtn!.trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('uses custom button config if provided', async () => {
    const engine = createEngineMock()
    const wrapper = mount(StepWizardShell, {
      props: {
        engine: engine as any,
        defaultButtonConfig: {
          previous: { label: 'Go Back', position: 'left', visible: true },
          next: { label: 'Proceed', position: 'right', visible: true },
          cancel: { label: 'Cancel', position: 'center', visible: true }
        }
      },
      global: {
        stubs: {
          VuescapeButton
        }
      }
    })
    await flushPromises()
    const btns = wrapper.findAllComponents({ name: 'VuescapeButton' })
    expect(btns.at(0)!.text()).toBe('Go Back')
    expect(btns.at(1)!.text()).toBe('Cancel')
    expect(btns.at(2)!.text()).toBe('Proceed')
  })

  it('merges step-level buttonConfig with default buttonConfig', async () => {
    const engineWithStepConfig = createEngineMock({
      buttonConfig: {
        next: { label: 'Continue', position: 'right', visible: true }
      }
    })

    const wrapper = mount(StepWizardShell, {
      props: {
        engine: engineWithStepConfig as any,
        defaultButtonConfig: {
          previous: { label: 'Go Back', position: 'left', visible: true },
          cancel: { label: 'Cancel', position: 'center', visible: true }
        }
      },
      global: {
        stubs: {
          VuescapeButton
        }
      }
    })
    await flushPromises()

    const btns = wrapper.findAllComponents({ name: 'VuescapeButton' })
    expect(btns.at(0)!.text()).toBe('Go Back')
    expect(btns.at(1)!.text()).toBe('Cancel')
    // Step-level config should override for next button
    expect(btns.at(2)!.text()).toBe('Continue')
  })
})
