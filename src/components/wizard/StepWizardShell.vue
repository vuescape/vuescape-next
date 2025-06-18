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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { fastHash } from '../../infrastructure/fastHash'
import type { StepWizardShellProps } from '../../models/componentProps/StepWizardShellProps'
import VuescapeButton from '../VuescapeButton.vue'

const emit = defineEmits<{
  (e: 'update', stepId: string, payload: any): void
  (e: 'finished', state: Record<string, any>): void
  (e: 'cancel'): void
}>()

const props = defineProps<StepWizardShellProps>()

/**
 * Computed property that returns an object representing the button text(s)
 * for the StepWizardShell component. The returned object may contain
 * dynamic values based on the current state of the wizard.
 *
 * @returns {Object} An object with button text(s) for the wizard UI.
 */
const uiElement = computed(() => ({
  previousStepButtonText: props.backButtonText ?? 'Back',
  nextStepButtonText: props.nextButtonText ?? 'Next',
  lastStepButtonText: props.lastButtonText ?? 'Finish',
  title: props.title,
  maxContainerWidth: props.maxContainerWidth ?? '1070px',
  shouldShowCancelButton: props.shouldShowCancelButton ?? false
}))

/**
 * Computes the current step component to render in the wizard.
 *
 * @returns {Component|null} The Vue component for the current step, or null if not set.
 */
const stepComponent = computed(() => props.engine.currentNode?.value?.component ?? null)

/**
 * Computes and returns the current value of the step wizard's engine properties.
 */
const stepProps = computed(() => props.engine.props.value)

/**
 * Computes a hash value based on the current props.
 * This computed property is used to track changes in props
 * and trigger updates or reactivity in the component when props change.
 *
 * @returns {string} A hash representing the current state of the props.
 */
const propsHash = computed(() => {
  const hash = props.engine.currentNode.value.hash
  // Use defined hash function or fallback to default hash function
  const result = hash
    ? hash(props.engine.context, props.engine.currentNode.value.props)
    : typeof props.engine.currentNode.value.props === 'function'
      ? fastHash(props.engine.currentNode.value.props(props.engine.context))
      : fastHash(props.engine.currentNode.value.props)
  return result
})

const canContinue = ref(false)

/**
 * Handles updates triggered by wizard step changes.
 *
 * @param {any} payload - The data associated with the update event.
 *   This may include information about the current step, user input, or other relevant state.
 */
function handleUpdate(payload: any) {
  props.engine.updateStepState(props.engine.currentStepId.value, payload)
  emit('update', props.engine.currentStepId.value, payload)
}

/**
 * Handles the logic for determining if the wizard can proceed to the next step.
 * @param {boolean} valid - Indicates whether the current step's data is valid and the user can continue.
 */
function handleCanContinue(valid: boolean) {
  canContinue.value = valid
}

/**
 * Handles the logic for moving to the next step in the wizard.
 * Typically called when the user clicks the "Next" button.
 * May include validation, state updates, or navigation logic.
 */
function handleNext() {
  if (props.engine.isLastStep.value) {
    emit('finished', props.engine.context.state)
  } else {
    props.engine.goNext()
  }
}

/**
 * Handles the logic for navigating to the previous step in the wizard.
 * Typically invoked when the user clicks the "Back" button.
 * Implement any necessary state updates or validations before moving back.
 */
function handleBack() {
  props.engine.goBack()
}

function handleCancel() {
  emit('cancel')
}

let styleTag: HTMLStyleElement | null = null

/**
 * Dynamically add CSS to handle responsive layout.
 * Use the maxContainerWidth from the theme to set the max-width of the inner container.
 * This is done as a dynamic style because media query must be a static value so to avoid
 * hardcoding the value, we use the theme prop injected dynamically.
 */
onMounted(() => {
  styleTag = document.createElement('style')
  styleTag.textContent = `
    @media (max-width: ${uiElement.value.maxContainerWidth}) {
      .wizard-buttons-inner {
        max-width: 100%;
        padding: 0 1rem;
      }
    }
  `
  document.head.appendChild(styleTag)
})

/**
 * Remove the style tag from the parent when the component is unmounted
 */
onUnmounted(() => {
  if (styleTag && styleTag.parentNode) {
    styleTag.parentNode.removeChild(styleTag)
  }
})
</script>

<template>
  <div class="step-wizard-container">
    <!-- Render current step's component -->
    <div v-if="uiElement.title" class="text-center text-xl font-semibold mb-4">
      {{ uiElement.title }}
    </div>
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
          <div class="flex flex-none">
            <VuescapeButton
              :disabled="engine.context.history.length <= 1"
              :label="uiElement.previousStepButtonText"
              @click="handleBack"
            />
          </div>
          <div v-if="uiElement.shouldShowCancelButton" class="flex ml-auto mr-4 items-center">
            <VuescapeButton
              :disabled="engine.context.history.length <= 1"
              label="Cancel"
              :outlined="true"
              @click="handleCancel"
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
