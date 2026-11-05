import { describe, expect, it, vi } from 'vitest'

import {
  APP_SHELL_CONTENT_CLASS,
  FALLBACK_SPACE_BELOW_TABLE,
  getSpaceBelow,
  SPLIT_PANE_CLASS,
  SPLIT_PANES_CLASS,
} from '../tableLayout'

function setBottom(element: HTMLElement, bottom: number) {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({ bottom } as DOMRect)
}

function buildShell() {
  const shellContent = document.createElement('div')
  shellContent.className = APP_SHELL_CONTENT_CLASS
  const pane = document.createElement('div')
  const table = document.createElement('div')
  pane.appendChild(table)
  shellContent.appendChild(pane)
  document.body.appendChild(shellContent)
  return { shellContent, table }
}

describe('getSpaceBelow', () => {
  it('should measure from the element to the bottom of the shell content', () => {
    // Arrange
    const { shellContent, table } = buildShell()
    setBottom(shellContent, 900)
    setBottom(table, 809)
    const systemUnderTest = getSpaceBelow

    // Act
    const actual = systemUnderTest(table)

    // Assert: e.g. tab panel padding + pane padding + the shell's footer padding (18 + 30 + 43).
    expect(actual).toBe(91)
  })

  it('should not go negative when the element overflows the shell content', () => {
    const { shellContent, table } = buildShell()
    setBottom(shellContent, 800)
    setBottom(table, 810)

    expect(getSpaceBelow(table)).toBe(0)
  })

  it('should not count a taller pane beside the element as space below it', () => {
    // Arrange: a table in the left pane, beside a center pane that reaches the panes' bottom at 850
    const shellContent = document.createElement('div')
    shellContent.className = APP_SHELL_CONTENT_CLASS
    const panes = document.createElement('div')
    panes.className = SPLIT_PANES_CLASS
    panes.style.borderBottom = '1px solid'
    const leftPane = document.createElement('div')
    leftPane.className = SPLIT_PANE_CLASS
    const table = document.createElement('div')
    leftPane.appendChild(table)
    panes.appendChild(leftPane)
    shellContent.appendChild(panes)
    document.body.appendChild(shellContent)
    setBottom(shellContent, 893)
    setBottom(panes, 850)
    setBottom(leftPane, 616)
    setBottom(table, 600)
    const systemUnderTest = getSpaceBelow

    // Act
    const actual = systemUnderTest(table)

    // Assert: the left pane's padding below the table, the panes' border, and the shell's footer padding below the
    // panes (16 + 1 + 43)
    expect(actual).toBe(60)
  })

  it('should fall back when the element is outside the app shell', () => {
    const table = document.createElement('div')
    document.body.appendChild(table)

    expect(getSpaceBelow(table)).toBe(FALLBACK_SPACE_BELOW_TABLE)
  })
})
