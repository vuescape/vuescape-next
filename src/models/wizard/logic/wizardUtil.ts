import { computed, markRaw, reactive, ref } from 'vue'
import type { WizardComponent } from '../WizardComponent'
import type { WizardContext } from '../WizardContext'
import type { WizardEngine } from '../WizardEngine'
import type { WizardGraph } from '../WizardGraph'
import type { WizardState } from '../WizardState'
import type { FileUploadComponentData } from '../survey-components/FileUploadComponentData'
import type { SelectComponentData } from '../survey-components/SelectComponentData'
import type { SurveyStepState } from '../survey-components/SurveyStepState'
import type { TextInputComponentData } from '../survey-components/TextInputComponentData'

/**
 * Creates a wizard engine to manage the flow of steps in a wizard-like interface.
 *
 * @param graph - A `WizardGraph` object that defines the structure of the wizard, including steps and transitions.
 * @param startId - The ID of the initial step in the wizard.
 * @param initialState - An optional initial state object for the wizard. Defaults to an empty object.
 * @param initialHistory - An optional initial history for the wizard. Defaults to an empty array.
 * @returns A `WizardEngine` object that provides methods and properties to control and interact with the wizard.
 *
 * The returned `WizardEngine` includes:
 * - `currentStepId`: A reactive reference to the current step ID.
 * - `currentNode`: A computed reference to the current step node in the graph.
 * - `props`: A computed object of properties for the current step, derived from the graph and context.
 * - `isLastStep`: A computed boolean indicating whether the current step is the last step in the wizard.
 * - `goNext`: A function to transition to the next step, if available.
 * - `goBack`: A function to return to the previous step, if possible.
 * - `updateStepState`: A function to update the state of a specific step.
 * - `context`: The wizard context, including state, current step ID, history, and the `updateState` function.
 */
export function createWizardEngine(
  graph: WizardGraph,
  startId: string,
  initialState: WizardState = {},
  initialHistory: string[] = []
): WizardEngine {
  const currentStepId = ref(startId)
  const state = reactive<WizardState>({ ...initialState })
  const history = ref<string[]>(initialHistory.length > 0 ? initialHistory : [startId]) // Use provided history or default to startId

  function updateState(stepId: string, payload: any) {
    state[stepId] = payload
  }

  const context: WizardContext = {
    state,
    currentStepId: computed(() => currentStepId.value).value,
    history: history.value,
    updateState
  }

  const currentNode = computed(() => graph[currentStepId.value])

  const props = computed(() => (currentNode.value?.props ? currentNode.value.props(context) : {}))

  const isLastStep = computed(() => currentNode.value?.next(context) === null)

  function goNext() {
    const nextId = currentNode.value?.next(context)
    if (nextId && graph[nextId] && currentStepId.value !== nextId) {
      currentStepId.value = nextId
      history.value.push(nextId)
    }
  }

  function goBack() {
    if (history.value.length > 1) {
      history.value.pop()
      currentStepId.value = history.value[history.value.length - 1]
    }
  }

  function updateStepState(stepId: string, payload: any) {
    updateState(stepId, payload)
  }

  return {
    currentStepId,
    currentNode,
    props,
    isLastStep,
    goNext,
    goBack,
    updateStepState,
    context
  }
}

/**
 * Casts a given component to a `WizardComponent` type.
 *
 * This utility function is used to ensure that a component conforms to the
 * `WizardComponent` type by performing a type assertion. Note that this does
 * not perform any runtime validation and assumes the input component is
 * compatible with the `WizardComponent` type.
 *
 * Curerntly this casts to WizardComponent<any> due to Typescript not being able to infer correctly from Vue's
 * dynamic typing. This is a temporary solution to get the code working, and in the future we may want to
 * make this more specific.
 *
 * Also the component is marked as raw to prevent Vue from trying to make it reactive.
 * This is important for performance and to avoid unnecessary reactivity in the component.
 *
 * @param component - The component to be cast to `WizardComponent`.
 * @returns The input component cast as a `WizardComponent`.
 */
export function asWizardComponent(component: any): WizardComponent<any> {
  return markRaw(component) as unknown as WizardComponent<any>
}

/**
 * Populates form data from the component survey data.
 * @param formData The FormData object to populate
 * @param surveyData The survey component data from the wizard state
 */
export function populateFormDataFromComponents(
  formData: FormData,
  surveyData: SurveyStepState
): void {
  for (const [fieldKey, componentData] of Object.entries(surveyData)) {
    if (
      !componentData ||
      typeof componentData !== 'object' ||
      !('componentType' in componentData)
    ) {
      continue // Skip invalid component data
    }

    // Handle different component types
    switch (componentData.componentType) {
      case 'fileUpload':
        handleFileUploadComponent(formData, fieldKey, componentData)
        break

      case 'select':
        handleSelectComponent(formData, fieldKey, componentData)
        break

      // case 'textInput':
      //   handleTextInputComponent(formData, fieldKey, componentData)
      //   break

      default:
        // Log unhandled component types for debugging
        console.warn(
          `Unhandled component type in survey: ${(componentData as any).componentType}`,
          componentData
        )
    }
  }
}

function handleFileUploadComponent(
  formData: FormData,
  fieldKey: string,
  componentData: FileUploadComponentData
): void {
  const { files } = componentData as { files: File[] }

  if (Array.isArray(files)) {
    for (const file of files) {
      if (file instanceof File) {
        formData.append(fieldKey, file, file.name)
      }
    }
  }
}

function handleSelectComponent(
  formData: FormData,
  fieldKey: string,
  componentData: SelectComponentData
): void {
  const { selectedValue } = componentData as { selectedValue: any }

  if (selectedValue !== undefined) {
    const value =
      typeof selectedValue === 'object' && selectedValue !== null
        ? JSON.stringify(selectedValue)
        : String(selectedValue)

    formData.append(fieldKey, value)
  }
}

// function handleTextInputComponent(
//   formData: FormData,
//   fieldKey: string,
//   componentData: TextInputComponentData
// ): void {
//   const { value } = componentData as { value: string }

//   if (value !== undefined) {
//     formData.append(fieldKey, String(value))
//   }
// }
