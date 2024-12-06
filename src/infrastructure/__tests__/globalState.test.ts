import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { registerGlobalVariable } from '../globalState'

describe('registerGlobalVariable', () => {
  let originalWindow: any

  beforeEach(() => {
    originalWindow = { ...window } // Backup the original window object

    // Define a mock crypto object or use a real one as needed
    const mockCrypto = {
      getRandomValues: (arr: any) => arr // Example mock implementation
    }

    // Mock the crypto property on the window object
    Object.defineProperty(window, 'crypto', {
      configurable: true, // This allows the property to be deleted or re-configured later
      enumerable: true,
      get: () => mockCrypto,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      set: (value) => {} // Optional: define a setter if you need to overwrite this in tests
    })
  })

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore TS2790
    delete window.crypto // Clean up by removing the mock
    Object.assign(window, originalWindow) // Restore the original window object
  })

  it('should register a new variable if it does not exist', () => {
    const name = 'newVar'
    const value = 'newValue'
    registerGlobalVariable(name, value)
    expect(window[name]).toBe(value)
  })

  it('should not overwrite an existing variable if shouldAlwaysRegister is false', () => {
    const name = 'existingVar'
    const initialValue = 'initialValue'
    window[name] = initialValue
    registerGlobalVariable(name, 'newValue')
    expect(window[name]).toBe(initialValue)
  })

  it('should overwrite an existing variable if shouldAlwaysRegister is true', () => {
    const name = 'overwriteVar'
    const initialValue = 'initialValue'
    window[name] = initialValue
    registerGlobalVariable(name, 'newValue', true)
    expect(window[name]).toBe('newValue')
  })
})
