/**
 * Represents a single line item of metadata, including display text, associated icons, and CSS classes for styling.
 */
/**
 * Represents a single line item of metadata with associated icons and styling.
 */
export interface MetadataLineItem {
  /**
   * Unique identifier for the metadata line item.
   */
  id: string
  /**
   * Array of icon identifiers associated with this line item.
   */
  icons: Array<string>
  /**
   * CSS class name(s) to apply to the icons for styling.
   */
  iconClass: string
  /**
   * The main text content of the metadata line item.
   */
  text: string
  /**
   * CSS class name(s) to apply to the text for styling.
   */
  textClass: string
}
