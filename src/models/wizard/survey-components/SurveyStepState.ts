import type { SurveyComponentData } from './SurveyComponentData'

/**
 * Type for the survey step state in the wizard
 */
export interface SurveyStepState {
  [fieldKey: string]: SurveyComponentData
}
