import { expect, suite, test } from 'vitest'
import { ApplicationBootstrapper } from '../../infrastructure/ApplicationBootstrapper'

suite('ApplicationBootstrapper', () => {
  test('all "with" methods should return the current instance', () => {
    const bootstrapper = new ApplicationBootstrapper()

    // Retrieve all public methods from the prototype that start with "with"
    const withMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(bootstrapper))
      .filter((method) => method.startsWith('with'))
      .filter((method) => typeof bootstrapper[method] === 'function')

    // Assert each "with" method returns the current instance
    withMethods.forEach((method) => {
      const result = bootstrapper[method]()
      expect(result).toBe(bootstrapper)
    })
  })
})
