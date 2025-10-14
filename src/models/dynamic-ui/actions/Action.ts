import type { DownloadAction } from './DownloadAction'
import type { NavigationAction } from './NavigationAction'
import type { NoAction } from './NoAction'
import type { SelectNavigationAction } from './SelectNavigationAction'

/**
 * Represents an action that can be either a NavigationAction, DownloadAction, or NoAction.
 * 
 * @typedef {NavigationAction | DownloadAction | NoAction} Action
 */
export type Action = SelectNavigationAction | NavigationAction | DownloadAction | NoAction 
