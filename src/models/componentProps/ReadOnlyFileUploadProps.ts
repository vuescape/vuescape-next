import type { DownloadAction } from '../dynamic-ui/actions/DownloadAction'
import type { MetadataLineItem } from '../dynamic-ui/MetadataLineItem'

/**
 * Properties for the ReadOnlyFileUpload component.
 */
export interface ReadOnlyFileUploadProps {
  /**
   * Unique identifier for the file upload.
   */
  id: string

  /**
   * Name of the uploaded file.
   */
  fileName: string

  /**
   * Size of the uploaded file in bytes.
   */
  fileSizeInBytes: number

  /**
   * Navigation action to trigger file download.
   */
  downloadAction: DownloadAction

  /**
   * List of metadata line items associated with the file.
   */
  metadataLineItems: Array<MetadataLineItem>
}
