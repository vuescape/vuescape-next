import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import VuescapeSelect from '../VuescapeSelect.vue'
import PrimeVue from 'primevue/config'
import PrimeVueSelect from 'primevue/select'
import { describe, expect, it, vi } from 'vitest'

const testEvent = async (
  eventName: string,
  eventPayload:
    | string
    | {
        name: string
      }
    | undefined
) => {
  const mockEventHandler = vi.fn()

  const ParentComponent = {
    components: { VuescapeSelect },
    template: `
      <VuescapeSelect
        v-bind="props"
        @${eventName}="onEvent"
      />
    `,
    setup() {
      return {
        props: {
          options: [{ name: 'Option 1' }, { name: 'Option 2' }],
          value: { name: 'Option 1' },
          name: 'test-select',
          optionLabel: 'name',
          placeholder: 'Select One of the Options',
          disabled: false,
          cssClass: 'custom-class'
        },
        onEvent: mockEventHandler
      }
    }
  }

  const wrapper = mount(ParentComponent, {
    global: {
      plugins: [
        PrimeVue,
        createTestingPinia({
          createSpy: vi.fn
        })
      ],
      components: {
        Select: PrimeVueSelect
      }
    }
  })

  // Find the PrimeVue Select component inside VuescapeSelect
  const selectComponent = wrapper.findComponent(PrimeVueSelect)

  // Simulate the event on the PrimeVue Select component
  await selectComponent.vm.$emit(eventName, eventPayload)

  // Assert that the mock event handler was called with the expected payload
  return mockEventHandler
}

describe('VuescapeSelect.vue - Modular Event Testing', () => {
  const testCases = [
    {
      eventName: 'update:modelValue',
      eventPayload: { name: 'Option 1' }
    },
    {
      eventName: 'value-change',
      eventPayload: { name: 'Option 2' }
    },
    {
      eventName: 'focus',
      eventPayload: undefined
    },
    {
      eventName: 'blur',
      eventPayload: undefined
    },
    {
      eventName: 'show',
      eventPayload: undefined
    },
    {
      eventName: 'hide',
      eventPayload: undefined
    },
    {
      eventName: 'filter',
      eventPayload: 'filtered text'
    }
  ]

  for (const { eventName, eventPayload } of testCases) {
    it(`handles ${eventName} event correctly`, async () => {
      const mockEventHandler = await testEvent(eventName, eventPayload)
      expect(mockEventHandler).toHaveBeenCalledWith(eventPayload)
    })
  }
})
