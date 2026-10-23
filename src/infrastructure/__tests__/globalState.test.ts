import { afterEach, describe, expect, it } from 'vitest'
import { registerGlobalVariable } from '../globalState'

describe('registerGlobalVariable', () => {
  afterEach(() => {
    // Remove only the variables these tests register. Restoring a copy of the whole window
    // throws in jsdom, where properties such as navigator have a getter and no setter.
    for (const name of ['newVar', 'existingVar', 'overwriteVar']) {
      delete (window as any)[name]
    }
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
