<script lang="ts">
/**
 * StepWizard @component
 *
 * This is a Vue Single File Component (SFC) that renders a Step Wizard
 *
 * @prop {StepWizardProps} - the StepWizardProps
 *
 */
export default {}
</script>

<script lang="ts" setup>
import type { StepWizardProps } from '../../models/componentProps/StepWizardProps'

import VuescapeButton from '../VuescapeButton.vue'
import Stepper from 'primevue/stepper'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const maxContainerWidth = '1070px'

// Child components

// Zod + interface for final validation
const emit = defineEmits(['previous', 'next', 'complete', 'cancel', 'step-change'])
debugger
const props = defineProps<StepWizardProps>()
const buttonText = computed(() => ({
  previousStepButtonText: props.previousStepButtonText ?? 'Back',
  nextStepButtonText: props.nextStepButtonText ?? 'Next',
  lastStepButtonText: props.lastStepButtonText ?? 'Finish',
}))

// Maintain reactivity
const wizardStepState = props.wizardStepState ?? <Record<string, any>>{}

// 1) Our wizard steps array
// const wizardSteps = computed(() => props.steps)

// 2) Track which step is active
const activeStepIndex = ref(0)

function onStepChange(newIndex: number) {
  // Optionally validate before allowing random step jumps
  activeStepIndex.value = newIndex
}
const currentStep = computed(() => props.steps[activeStepIndex.value])

function validateStep() {
  const stepComponent = currentStep.value
  const stepState = wizardStepState[stepComponent.id]
  if (stepComponent.validationSchema || stepComponent.onValidate) {
    // Do the validations
    if (stepComponent.validationSchema) {
      const validationResult = stepComponent.validationSchema.safeParse(stepState)
      if (validationResult.success) {
        if (stepComponent.onValidate) {
          const isValid = stepComponent.onValidate(stepState)
          if (!isValid) {
            return false
          }
        }
      } else {
        return false
      }
    }
  }
  return true
}

function onNextClick() {
  debugger
  // Call the child's validation method
  if (!validateStep()) {
    return
  }

  // Otherwise, move to the next step
  if (activeStepIndex.value < props.steps.length - 1) {
    emit('next', activeStepIndex.value)
    activeStepIndex.value++
  }
}

function onPreviousClick() {
  if (activeStepIndex.value > 0) {
    emit('previous')
    activeStepIndex.value--
  }
}

function onFinishClick() {
  debugger
  if (!validateStep()) {
    return
  }

  emit('complete')
  // TODO: Validate the entire wizard data
}

let styleTag: HTMLStyleElement | null = null

// Dynamically add CSS to handle responsive layout.
// Use the maxContainerWidth from the theme to set the max-width of the inner container.
// This is done as a dynamic style because media query must be a static value so to avoid
// hardcoding the value, we use the theme prop injected dynamically.
onMounted(() => {
  styleTag = document.createElement('style')
  styleTag.textContent = `
    @media (max-width: ${props.maxContainerWidth ?? maxContainerWidth}) {
      .wizard-buttons-inner {
        max-width: 100%;
        padding: 0 1rem;
      }
    }
  `
  document.head.appendChild(styleTag)
})

onUnmounted(() => {
  // Remove the style tag when the component is unmounted
  if (styleTag && styleTag.parentNode) {
    styleTag.parentNode.removeChild(styleTag)
  }
})

function onStepDataChange(event: unknown) {
  debugger
  const stepComponent = currentStep.value
  wizardStepState[stepComponent.id] = event
}
</script>

<template>
  <div class="step-wizard-container">
    <Stepper
      :model="steps"
      :activeIndex="activeStepIndex"
      style="margin-bottom: 1rem"
      @update:activeIndex="onStepChange"
    />
    <!-- Render current step's component -->
    <KeepAlive>
      <component
        :key="currentStep.id"
        :is="currentStep.component"
        v-bind="currentStep.payload as object"
        @change="onStepDataChange"
      />
    </KeepAlive>
    <div class="wizard-buttons fixed bottom-0 left-0 right-0 mb-6">
      <!-- Inner container to align buttons with main content -->
      <div
        class="mx-auto wizard-buttons-inner"
        style="width: calc(var(--p-max-container-width) + 40px)"
      >
        <div class="flex items-center">
          <!-- Left side container: Back button (if any) -->
          <div>
            <VuescapeButton
              v-if="activeStepIndex > 0"
              :label="buttonText.previousStepButtonText"
              @click="onPreviousClick"
            />
          </div>
          <!-- Right side container: Next/Finish buttons, pushed right with ml-auto -->
          <div class="flex gap-2 ml-auto">
            <VuescapeButton
              v-if="activeStepIndex < steps.length - 1"
              :label="buttonText.nextStepButtonText"
              @click="onNextClick"
            />
            <VuescapeButton
              v-else
              :label="buttonText.lastStepButtonText"
              class="p-button-success"
              @click="onFinishClick"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
