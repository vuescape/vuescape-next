/**
 * Class representing the dimension of a scrollbar.
 * It provides a method to get the width of the scrollbar.
 *
 * @property scrollBarWidth - The width of the scrollbar.
 */
export class ScrollBarDimension {
  private readonly scrollBarWidth: number

  /**
   * Creates a ScrollBarDimension instance and calculates the scrollbar width.
   */
  constructor() {
    this.scrollBarWidth = this.getScrollbarWidth()
  }

  /**
   * Gets the width of the scrollbar.
   *
   * @returns The width of the scrollbar.
   */
  public get width() {
    return this.scrollBarWidth
  }

  /**
   * Calculates the width of the scrollbar.
   * It creates a temporary div, makes it scrollable, appends it to the document body, measures its inner width, and then removes it.
   *
   * @returns The calculated width of the scrollbar.
   */
  private getScrollbarWidth() {
    // Add temporary box to wrapper
    const scrollBarDiv = document.createElement('div')

    // Make box scrollable
    scrollBarDiv.style.overflow = 'scroll'

    // Append box to document
    document.body.appendChild(scrollBarDiv)

    // Measure inner width of box
    const result = scrollBarDiv.offsetWidth - scrollBarDiv.clientWidth

    // Remove box
    document.body.removeChild(scrollBarDiv)

    return result
  }
}
