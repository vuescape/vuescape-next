/* eslint-disable */
import { addScript, loadScriptFromUrl } from '../../infrastructure/scriptHelpers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('scriptHelpers', () => {
  let createElementSpy, appendChildSpy, querySelectorSpy

  beforeEach(() => {     
    // @ts-ignore TS2740
    createElementSpy = vi.spyOn(document, 'createElement').mockImplementation(() => ({
      setAttribute: vi.fn(),
      remove: vi.fn()
    }))
    // @ts-ignore TS2345
    appendChildSpy = vi.spyOn(document.head, 'appendChild').mockImplementation(() => {})
    querySelectorSpy = vi.spyOn(document.head, 'querySelector').mockImplementation(() => null)
  })

  afterEach(() => {
    // @ts-ignore TS7005
    createElementSpy.mockRestore()
    // @ts-ignore TS7005
    appendChildSpy.mockRestore()
    // @ts-ignore TS7005
    querySelectorSpy.mockRestore()
  })

  describe('addScript', () => {
    it('adds a script to the document head', () => {
      addScript('console.log("Hello, World!");', 'testScript')
      // @ts-ignore TS7005
      expect(createElementSpy).toHaveBeenCalledWith('script')
      // @ts-ignore TS7005
      expect(appendChildSpy).toHaveBeenCalled()
    })

    it('removes existing script if ID matches', () => {
      // @ts-ignore TS7005
      querySelectorSpy.mockImplementation(() => ({
        remove: vi.fn()
      }))
      addScript('console.log("Hello again!");', 'testScript')
      // @ts-ignore TS7005
      expect(querySelectorSpy).toHaveBeenCalledWith('#testScript')
    })
  })

  describe('loadScriptFromUrl', () => {
    it('loads a script from URL asynchronously', () => {
      loadScriptFromUrl('https://example.com/script.js', 'remoteScript')
      // @ts-ignore TS7005
      expect(createElementSpy).toHaveBeenCalledWith('script')
      // @ts-ignore TS7005
      expect(appendChildSpy).toHaveBeenCalled()
    })

    it('removes existing script if ID matches', () => {
      // @ts-ignore TS7005
      querySelectorSpy.mockImplementation(() => ({
        remove: vi.fn()
      }))
      loadScriptFromUrl('https://example.com/newscript.js', 'remoteScript')
      // @ts-ignore TS7005
      expect(querySelectorSpy).toHaveBeenCalledWith('script#remoteScript')
    })
  })
})
