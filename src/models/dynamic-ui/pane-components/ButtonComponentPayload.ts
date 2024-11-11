import type { Action } from '../actions/Action'

export interface ButtonComponentPayload {
  label: string
  action: Action
  icons?: Array<string> // Icons to display on the button
}
