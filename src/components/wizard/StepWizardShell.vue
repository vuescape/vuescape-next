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
import { computed, ref, toRefs } from 'vue'
import { fastHash } from '../../infrastructure/fastHash'
import type { StepWizardShellProps } from '../../models/componentProps/StepWizardShellProps'
import type { ButtonConfig, ButtonDefinition, ButtonPosition } from '../../models/wizard/ButtonConfig'
import { DEFAULT_BUTTON_CONFIG } from '../../models/wizard/ButtonConfig'
import WizardNavigationButtons from './WizardNavigationButtons.vue'

const emit = defineEmits<{
  (e: 'update', stepId: string, payload: any): void
  (e: 'finished', state: Record<string, any>): void
  (e: 'cancel'): void
}>()

const props = defineProps<StepWizardShellProps>()
const {
  title,
  helpCenterUrl,
  maxContainerWidth
} = toRefs(props)

const uiElement = computed(() => ({
  title: title.value,
  helpCenterUrl: helpCenterUrl.value,
  maxContainerWidth: maxContainerWidth.value ?? '1070px'
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
 * Helper function to merge button definitions with fallback priority
 */
function mergeButtonDefinition(
  stepDef: ButtonDefinition | undefined,
  defaultDef: ButtonDefinition | undefined,
  baseDef: ButtonDefinition
): ButtonDefinition {
  return {
    visible: stepDef?.visible ?? defaultDef?.visible ?? baseDef.visible,
    position: stepDef?.position ?? defaultDef?.position ?? baseDef.position,
    label: stepDef?.label ?? defaultDef?.label ?? baseDef.label,
    variant: stepDef?.variant ?? defaultDef?.variant ?? baseDef.variant,
    disabled: stepDef?.disabled ?? defaultDef?.disabled ?? baseDef.disabled
  }
}

/**
 * Resolves the button configuration for the current step.
 * Priority: step buttonConfig → defaultButtonConfig → DEFAULT_BUTTON_CONFIG
 */
const resolvedButtonConfig = computed<ButtonConfig>(() => {
  const currentNode = props.engine.currentNode.value
  const nodeConfig = currentNode.buttonConfig

  // Resolve node button config (could be static or function)
  let stepConfig: ButtonConfig | undefined
  if (nodeConfig) {
    stepConfig = typeof nodeConfig === 'function'
      ? nodeConfig(props.engine.context)
      : nodeConfig
  }

  const defaultConfig = props.defaultButtonConfig

  // Merge configurations with fallbacks
  const previous = mergeButtonDefinition(
    stepConfig?.previous,
    defaultConfig?.previous,
    DEFAULT_BUTTON_CONFIG.previous!
  )

  const next = mergeButtonDefinition(
    stepConfig?.next,
    defaultConfig?.next,
    DEFAULT_BUTTON_CONFIG.next!
  )

  const cancel = mergeButtonDefinition(
    stepConfig?.cancel,
    defaultConfig?.cancel,
    DEFAULT_BUTTON_CONFIG.cancel!
  )

  // Apply dynamic overrides for disabled states and labels
  return {
    previous: {
      ...previous,
      disabled: stepConfig?.previous?.disabled ?? defaultConfig?.previous?.disabled ?? props.engine.context.history.length <= 1
    },
    next: {
      ...next,
      label: stepConfig?.next?.label ?? defaultConfig?.next?.label ??
        (props.engine.isLastStep.value ? 'Finish' : DEFAULT_BUTTON_CONFIG.next!.label),
      disabled: stepConfig?.next?.disabled ?? defaultConfig?.next?.disabled ?? !canContinue.value
    },
    cancel
  }
})

/**
 * Groups buttons by position for rendering
 */
const buttonsByPosition = computed(() => {
  const config = resolvedButtonConfig.value
  const groups: Record<ButtonPosition, Array<{ type: 'previous' | 'next' | 'cancel', config: ButtonDefinition }>> = {
    left: [],
    center: [],
    right: []
  }

  if (config.previous?.visible) {
    groups[config.previous.position!].push({ type: 'previous', config: config.previous })
  }
  if (config.next?.visible) {
    groups[config.next.position!].push({ type: 'next', config: config.next })
  }
  if (config.cancel?.visible) {
    groups[config.cancel.position!].push({ type: 'cancel', config: config.cancel })
  }

  return groups
})

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
</script>

<template>
  <div class="step-wizard-container">
    <div
      v-if="uiElement.title || uiElement.helpCenterUrl"
      class="relative mb-6 flex items-center justify-center"
    >
      <!-- Centered title -->
      <div v-if="uiElement.title" class="text-xl font-bold">
        {{ uiElement.title }}
      </div>
      <div class="absolute right-0">
        <a
          v-if="uiElement.helpCenterUrl"
          target="_blank"
          :href="uiElement.helpCenterUrl"
          class="text-primary text-xl font-bold"
          title="Help"
        >
          <i class="far fa-circle-question primary" />
        </a>
      </div>
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
    <div class="wizard-buttons mt-12 mb-12">
      <!-- Inner container to align buttons with main content -->
      <div class="wizard-buttons-inner mx-auto">
        <WizardNavigationButtons
          :buttonsByPosition="buttonsByPosition"
          @previous="handleBack"
          @next="handleNext"
          @cancel="handleCancel"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-wizard-container {
  margin-top: 1.5rem;
}
</style>
