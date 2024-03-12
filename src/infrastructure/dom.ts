export function selectElementContents(elementId: string) {
  const element = document.getElementById(elementId)
  const body    = document.body as unknown as { createTextRange: () => any }
  if (document.createRange && window.getSelection) {
    const range = document.createRange()
    const sel   = window.getSelection()
    sel?.removeAllRanges()
    try {
      range.selectNodeContents(element as Node)
      sel?.addRange(range)
    }
    catch (e) {
      range.selectNode(element as Node)
      sel?.addRange(range)
    }
  }
  else if (body.createTextRange) {
    const range = body.createTextRange() as {
      moveToElementText: (arg0: HTMLElement | null) => void,
      select: () => void
    }
    range.moveToElementText(element)
    range.select()
  }
}
