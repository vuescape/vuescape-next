import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, markRaw } from 'vue'
import StepWizard from '../StepWizard.vue'

describe('StepWizard.vue', () => {
  let wrapper: any

  // Define mock components
  const Step1Component = defineComponent({
    name: 'Step1Component',
    template: '<div>Step 1</div>'
  })

  const Step2Component = defineComponent({
    name: 'Step2Component',
    template: '<div>Step 2</div>'
  })
  const steps = [
    {
      id: 'step1',
      label: 'Step 1',
      component: markRaw(Step1Component),
      payload: {},
      validationSchema: undefined,
      onValidate: undefined
    },
    {
      id: 'step2',
      label: 'Step 2',
      component: markRaw(Step2Component),
      payload: {},
      validationSchema: undefined,
      onValidate: undefined
    }
  ]

  beforeEach(() => {
    wrapper = mount(StepWizard, {
      props: {
        steps,
        previousStepButtonText: 'Previous!',
        nextStepButtonText: 'Next!',
        lastStepButtonText: 'Finish!',
        wizardStepState: undefined
      },
      global: {
        stubs: {
          VuescapeButton: {
            // We reintroduce 'label' as a prop on our stub
            props: ['label'],
            template: `
                  <button :label="label" @click="$emit('click')">
                    <slot />
                  </button>
                `
          }
        }
      }
    })
  })

  it('renders the first step initially', () => {
    // Assert
    expect(wrapper.findComponent(Step1Component).exists()).toBe(true)
  })

  it('moves to the next step when next button is clicked', async () => {
    // Act
    // Finds first button, which is "Next"
    await wrapper.find('button').trigger('click')

    // Assert
    expect(wrapper.findComponent(Step2Component).exists()).toBe(true)
  })

  it('moves to the next step and displays correct buttons', async () => {
    // Assert
    expect(wrapper.find('button[label="Next!"]').exists()).toBe(true)

    // Finds first button, which is "Next"
    await wrapper.find('button').trigger('click')

    expect(wrapper.find('button[label="Previous!"]').exists()).toBe(true)
    expect(wrapper.find('button[label="Finish!"]').exists()).toBe(true)
    expect(wrapper.find('button[label="Next!"]').exists()).toBe(false)
    expect(wrapper.findComponent(Step2Component).exists()).toBe(true)
  })

  it('moves to the previous step when previous button is clicked', async () => {
    // Act
    // Click "Next"
    await wrapper.find('button').trigger('click')
    // Click "Previous" (first button now)
    await wrapper.findAll('button')[0].trigger('click')

    // Assert
    expect(wrapper.findComponent(Step1Component).exists()).toBe(true)
  })

  it('emits complete event when finish button is clicked', async () => {
    // Act
    // Click the "Next!" button by label
    await wrapper.find('button[label="Next!"]').trigger('click')
    // Now the "Finish!" button should be rendered
    await wrapper.find('button[label="Finish!"]').trigger('click')

    // Assert
    expect(wrapper.emitted().complete).toBeTruthy()
  })
})
