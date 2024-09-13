import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ScrollBarDimension } from '../../infrastructure'

// @ts-nocheck
describe('ScrollBarDimension', () => {
  // @ts-ignore
  let createElementSpy, appendChildSpy, removeChildSpy

  beforeEach(() => {
    // Mock createElement to return a div with controlled offsetWidth and clientWidth
    // @ts-ignore
    createElementSpy = vi.spyOn(document, 'createElement').mockImplementation(() => {
      const div = {
        offsetWidth: 100,
        clientWidth: 90,
        style: {},
        remove: vi.fn(),
      }
      return div
    })

    // @ts-ignore
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {
    })
    // @ts-ignore
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {
    })
  })

  afterEach(() => {
    // @ts-ignore
    createElementSpy.mockRestore()
    // @ts-ignore
    appendChildSpy.mockRestore()
    // @ts-ignore
    removeChildSpy.mockRestore()
  })

  it('calculates scrollbar width correctly upon instantiation', () => {
    const scrollBarDimension = new ScrollBarDimension()
    expect(scrollBarDimension.width).toBe(10)
    // @ts-ignore
    expect(createElementSpy).toHaveBeenCalledWith('div')
    // @ts-ignore
    expect(appendChildSpy).toHaveBeenCalledTimes(1)
    // @ts-ignore
    expect(removeChildSpy).toHaveBeenCalledTimes(1)
  })

  it('width getter returns the correct scrollbar width', () => {
    const scrollBarDimension = new ScrollBarDimension()
    expect(scrollBarDimension.width).toBe(10)
  })
})
