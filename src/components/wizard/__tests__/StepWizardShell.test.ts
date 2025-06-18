import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import StepWizardShell from '../../wizard/StepWizardShell.vue'
import { ref, defineComponent, markRaw } from 'vue'

// Mock step component for testing
const DummyStep = markRaw(defineComponent({
  props: ['foo'],
  emits: ['update', 'can-continue'],
  template: `<div data-testid="dummy-step">{{ foo }}</div>`
}))

function createEngineMock({ isLastStep = false, historyLength = 2 } = {}) {
  return {
    currentNode: ref({
      value: {
        component: DummyStep,
        props: { foo: 'bar' },
        hash: undefined
      }
    }),
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
  it('renders title if provided', () => {
    const engine = createEngineMock()
    const wrapper = mount(StepWizardShell, {
      props: {
        engine,        
        title: 'My Wizard'
      }
    })
    expect(wrapper.text()).toContain('My Wizard')
  })

// TODO: Fix these tests
//   it('renders step component with correct props', () => {
//     const engine = createEngineMock()
//     const wrapper = mount(StepWizardShell, {
//       props: { engine }
//     })
//     console.log(wrapper.html())
//     expect(wrapper.find('[data-testid="dummy-step"]').exists()).toBe(true)
//     expect(wrapper.find('[data-testid="dummy-step"]').text()).toBe('bar')
//   })

//   it('emits update and calls engine.updateStepState on step update', async () => {
//     const engine = createEngineMock()
//     const wrapper = mount(StepWizardShell, {
//       props: { engine }
//     })
//     await wrapper.findComponent(DummyStep).vm.$emit('update', { foo: 'baz' })
//     expect(engine.updateStepState).toHaveBeenCalledWith('step-1', { foo: 'baz' })
//     expect(wrapper.emitted('update')).toBeTruthy()
//     expect(wrapper.emitted('update')![0]).toEqual(['step-1', { foo: 'baz' }])
//   })

//   it('enables Next button only when canContinue is true', async () => {
//     const engine = createEngineMock()
//     const wrapper = mount(StepWizardShell, {
//       props: { engine }
//     })
//     // Initially disabled
//     const nextBtn = wrapper.findAllComponents({ name: 'VuescapeButton' }).at(-1)!
//     expect(nextBtn.props('disabled')).toBe(true)
//     // Emit can-continue
//     await wrapper.findComponent(DummyStep).vm.$emit('can-continue', true)
//     await wrapper.vm.$nextTick()
//     expect(wrapper.findAllComponents({ name: 'VuescapeButton' }).at(-1)!.props('disabled')).toBe(
//       false
//     )
//   })

//   it('calls engine.goNext or emits finished on Next button click', async () => {
//     // Not last step
//     const engine = createEngineMock({ isLastStep: false })
//     const wrapper = mount(StepWizardShell, { props: { engine } })    
//     await wrapper.findComponent(DummyStep).vm.$emit('can-continue', true)
//     await wrapper.vm.$nextTick()
//     await wrapper.findAllComponents({ name: 'VuescapeButton' }).at(-1)!.trigger('click')
//     expect(engine.goNext).toHaveBeenCalled()

//     // Last step
//     const engine2 = createEngineMock({ isLastStep: true })
//     const wrapper2 = mount(StepWizardShell, { props: { engine: engine2 } })
//     await wrapper2.findComponent(DummyStep).vm.$emit('can-continue', true)
//     await wrapper2.vm.$nextTick()
//     await wrapper2.findAllComponents({ name: 'VuescapeButton' }).at(-1)!.trigger('click')
//     expect(wrapper2.emitted('finished')).toBeTruthy()
//     expect(wrapper2.emitted('finished')![0]).toEqual([{ some: 'state' }])
//   })

  it('calls engine.goBack on Back button click', async () => {
    const engine = createEngineMock()
    const wrapper = mount(StepWizardShell, { props: { engine } })
    await wrapper.findAllComponents({ name: 'VuescapeButton' }).at(0)!.trigger('click')
    expect(engine.goBack).toHaveBeenCalled()
  })

  it('disables Back and Cancel buttons if history length <= 1', () => {
    const engine = createEngineMock({ historyLength: 1 })
    const wrapper = mount(StepWizardShell, {
      props: { engine, shouldShowCancelButton: true }
    })
    const btns = wrapper.findAllComponents({ name: 'VuescapeButton' })
    // Back button
    expect(btns.at(0)!.props('disabled')).toBe(true)
    // Cancel button
    expect(btns.at(1)!.props('disabled')).toBe(true)
  })

  it('shows Cancel button if shouldShowCancelButton is true and emits cancel', async () => {
    const engine = createEngineMock()
    const wrapper = mount(StepWizardShell, {
      props: { engine, shouldShowCancelButton: true }
    })
    const cancelBtn = wrapper
      .findAllComponents({ name: 'VuescapeButton' })
      .find((btn) => btn.text() === 'Cancel')
    expect(cancelBtn).toBeTruthy()
    await cancelBtn!.trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('uses custom button texts if provided', () => {
    const engine = createEngineMock()
    const wrapper = mount(StepWizardShell, {
      props: {
        engine,
        backButtonText: 'Go Back',
        nextButtonText: 'Proceed',
        lastButtonText: 'Complete'
      }
    })
    const btns = wrapper.findAllComponents({ name: 'VuescapeButton' })
    expect(btns.at(0)!.text()).toBe('Go Back')
    // Next/Finish button
    expect(btns.at(-1)!.text()).toBe('Complete')
  })
})
