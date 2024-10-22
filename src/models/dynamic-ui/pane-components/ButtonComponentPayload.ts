import type { Action } from '../actions/Action'

export interface ButtonComponentPayload {
  text: string
  action: Action
  icons?: Array<string> // Icons to display on the button
}
