import type { NavigationAction } from './NavigationAction'
import type { NoAction } from './NoAction'
import type { SelectNavigationAction } from './SelectNavigationAction'

/**
 * Represents an action that can be either a NavigationAction or NoAction.
 * 
 * @typedef {NavigationAction | NoAction} Action
 */
export type Action = SelectNavigationAction | NavigationAction | NoAction 
