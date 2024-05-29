import { HorizontalAlignment } from '../TreeTable/HorizontalAlignment'

/**
 * Interface representing the format of a cell.
 */
export interface CellFormat {
  /** The font color in hex. Optional. */
  fontHexColor?: string

  /** The font size in pixels. Optional. */
  fontSizeInPixels?: string

  /** The background color in hex. Optional. */
  backgroundHexColor?: string

  /** The horizontal alignment. Optional. */
  horizontalAlignment?: HorizontalAlignment
}
