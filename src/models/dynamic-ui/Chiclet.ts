import type { Action } from "./actions/Action"

export interface Chiclet {
  id: string
  title: string
  isVisible: boolean
  icons?: Array<string>
  cssClass?: string
  action: Action
}
