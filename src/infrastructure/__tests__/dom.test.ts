import { describe, expect, it, vi } from 'vitest'
import { selectElementContents } from '../dom'

describe('selectElementContents', () => {
  it('selects the contents of an element with createRange and getSelection', () => {
    const elementId = 'testElement'
    const element = document.createElement('div')
    element.id = elementId
    document.body.appendChild(element)

    const mockRange = {
      selectNodeContents: vi.fn(),
      selectNode: vi.fn(),
    }
    const mockSelection = {
      removeAllRanges: vi.fn(),
      addRange: vi.fn(),
    }

    global.document.getElementById = vi.fn().mockReturnValue(element)
    global.document.createRange = vi.fn().mockReturnValue(mockRange)
    global.window.getSelection = vi.fn().mockReturnValue(mockSelection)

    selectElementContents(elementId)

    expect(document.createRange).toHaveBeenCalled()
    expect(window.getSelection).toHaveBeenCalled()
    expect(mockRange.selectNodeContents).toHaveBeenCalledWith(element)
    expect(mockSelection.addRange).toHaveBeenCalledWith(mockRange)

    document.body.removeChild(element)
  })

  it('uses createTextRange for older browsers', () => {
    const elementId = 'testElement'
    const element = document.createElement('div')
    element.id = elementId
    document.body.appendChild(element)

    const mockRange = {
      moveToElementText: vi.fn(),
      select: vi.fn(),
    }

    global.document.getElementById = vi.fn().mockReturnValue(element)

    // @ts-expect-error TS2790
    delete global.document.createRange
    // @ts-expect-error TS2790
    delete global.window.getSelection

    // @ts-expect-error TS2503
    global.document.body.createTextRange = vi.fn().mockReturnValue(mockRange)

    selectElementContents(elementId)

    // @ts-expect-error TS2503
    expect(document.body.createTextRange).toHaveBeenCalled()
    expect(mockRange.moveToElementText).toHaveBeenCalledWith(element)
    expect(mockRange.select).toHaveBeenCalled()

    document.body.removeChild(element)
  })

  it('does nothing if element does not exist', () => {
    const elementId = 'nonexistentElement'
    global.document.getElementById = vi.fn().mockReturnValue(null)

    expect(() => selectElementContents(elementId)).not.toThrow()

    // Additional assertions can be made to verify no selections are made
  })
})
