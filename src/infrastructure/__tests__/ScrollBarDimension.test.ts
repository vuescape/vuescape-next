import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ScrollBarDimension } from '../../infrastructure/ScrollBarDimension'

describe('ScrollBarDimension', () => {
  let createElementSpy, appendChildSpy, removeChildSpy

  beforeEach(() => {
    // Mock createElement to return a div with controlled offsetWidth and clientWidth
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {
    })
  })

  afterEach(() => {
    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })

  it('calculates scrollbar width correctly upon instantiation', () => {
    const scrollBarDimension = new ScrollBarDimension()
    expect(scrollBarDimension.width).toBe(10)
    expect(createElementSpy).toHaveBeenCalledWith('div')
    expect(appendChildSpy).toHaveBeenCalledTimes(1)
    expect(removeChildSpy).toHaveBeenCalledTimes(1)
  })

  it('width getter returns the correct scrollbar width', () => {
    const scrollBarDimension = new ScrollBarDimension()
    expect(scrollBarDimension.width).toBe(10)
  })
})
