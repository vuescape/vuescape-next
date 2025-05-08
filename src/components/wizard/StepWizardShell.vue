<script lang="ts">
/**
 * StepWizardShell @component
 *
 * This is a Vue Single File Component (SFC) that renders a Step Wizard
 *
 * @prop {StepWizardShellProps} - the StepWizardProps
 *
 */
export default {}
</script>

<script lang="ts" setup>
import type { StepWizardShellProps } from '../../models/componentProps/StepWizardShellProps'

import VuescapeButton from '../VuescapeButton.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const emit = defineEmits<{
  (e: 'update', stepId: string, payload: any): void
  (e: 'finished', state: Record<string, any>): void
}>()

const props = defineProps<StepWizardShellProps>()

const buttonText = computed(() => ({
  previousStepButtonText: props.backButtonText ?? 'Back',
  nextStepButtonText: props.nextButtonText ?? 'Next',
  lastStepButtonText: props.lastButtonText ?? 'Finish'
}))

const stepComponent = computed(() => props.engine.currentNode?.value?.component ?? null)
const stepProps = computed(() => props.engine.props.value)
const propsHash = computed(() => fastHash(stepProps.value))
const canContinue = ref(false)

// Maintain reactivity
// const wizardStepState = props.wizardStepState ?? <Record<string, any>>{}

function handleUpdate(payload: any) {
  props.engine.updateStepState(props.engine.currentStepId.value, payload)
  emit('update', props.engine.currentStepId.value, payload)
}

function handleCanContinue(valid: boolean) {
  canContinue.value = valid
}

// function validateStep() {
//   const stepComponent = currentStep.value
//   const stepState = wizardStepState[stepComponent.id]
//   if (stepComponent.validationSchema || stepComponent.onValidate) {
//     // Do the validations
//     if (stepComponent.validationSchema) {
//       const validationResult = stepComponent.validationSchema.safeParse(stepState)
//       if (validationResult.success) {
//         if (stepComponent.onValidate) {
//           const isValid = stepComponent.onValidate(stepState)
//           if (!isValid) {
//             return false
//           }
//         }
//       } else {
//         return false
//       }
//     }
//   }
//   return true
// }

function handleNext() {
  if (props.engine.isLastStep.value) {
    emit('finished', props.engine.context.state)
  } else {
    props.engine.goNext()
  }
}

function handleBack() {
  props.engine.goBack()
}

let styleTag: HTMLStyleElement | null = null

function fastHash(obj: unknown): string {
  return btoa(
    JSON.stringify(obj)
      .split('')
      .reduce((h, c) => (h << 5) - h + c.charCodeAt(0), 0) // 32-bit DJB2
      .toString()
  )
}

// Dynamically add CSS to handle responsive layout.
// Use the maxContainerWidth from the theme to set the max-width of the inner container.
// This is done as a dynamic style because media query must be a static value so to avoid
// hardcoding the value, we use the theme prop injected dynamically.
onMounted(() => {
  styleTag = document.createElement('style')
  styleTag.textContent = `
    @media (max-width: ${props.maxContainerWidth ?? '1070px'}) {
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
</script>

<template>
  <div class="step-wizard-container">
    <!-- Render current step's component -->
    <KeepAlive>
      <component
        v-if="stepComponent"
        :key="`${engine.currentStepId.value}-${propsHash}`"
        :data-key="`${engine.currentStepId.value}-${propsHash}`"
        :is="stepComponent"
        v-bind="stepProps"
        @update="handleUpdate"
        @can-continue="handleCanContinue"
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
              :disabled="engine.context.history.length <= 1"
              :label="buttonText.previousStepButtonText"
              @click="handleBack"
            />
          </div>
          <!-- Right side container: Next/Finish butt~ons, pushed right with ml-auto -->
          <div class="flex gap-2 ml-auto">
            <VuescapeButton
              :disabled="!canContinue"
              :label="
                engine.isLastStep
                  ? props.lastButtonText || 'Finish'
                  : props.nextButtonText || 'Next'
              "
              @click="handleNext"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
