export class ScrollBarDimension {
  private readonly scrollBarWidth: number

  constructor() {
    this.scrollBarWidth = this.getScrollbarWidth()
  }

  public get width() {
    return this.scrollBarWidth
  }

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
