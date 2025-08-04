import type { NavigationAction } from '../dynamic-ui/actions/NavigationAction'

/**
 * Properties for the ReadOnlyFileUpload component.
 */
export interface ReadOnlyFileUploadProps {
  id: string
  fileName: string
  fileSizeInBytes: number
  downloadNavigationAction: NavigationAction
}
