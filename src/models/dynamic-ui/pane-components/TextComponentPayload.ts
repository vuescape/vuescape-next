import type { RenderTextAs } from '../RenderTextAs'

/**
 * Represents the payload for a text component in the dynamic UI.
 */
export interface TextComponentPayload {
  /**
   * Unique identifier for the title component.
   */
  id: string

  /**
   * The title text to display.
   */
  text: string

  /**
   * The way to render the text.
   */
  renderTextAs: RenderTextAs
}
