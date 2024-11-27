import { ApplicationBootstrapper } from '../../infrastructure'
import { expect, suite, test } from 'vitest'

suite('ApplicationBootstrapper', () => {
  test('should initialize correctly with expected methods', () => {
    const bootstrapper = new ApplicationBootstrapper()

    // TODO: Brittle test using strings for method names
    expect(bootstrapper).to.respondTo('withInit')
    expect(bootstrapper).to.respondTo('withPinia')
    expect(bootstrapper).to.respondTo('withErrorHandler')
    expect(bootstrapper).to.respondTo('withRouter')
    expect(bootstrapper).to.respondTo('withTrackingService')
    // expect(bootstrapper).to.respondTo('withFeatureService')
    expect(bootstrapper).to.respondTo('withNavigationComponent')
    expect(bootstrapper).to.respondTo('withAdditionalComponents')
    expect(bootstrapper).to.respondTo('withRootComponent')
    expect(bootstrapper).to.respondTo('withHeaderComponent')
    expect(bootstrapper).to.respondTo('withFooterComponent')
    expect(bootstrapper).to.respondTo('withPrimeVueTheme')
    expect(bootstrapper).to.respondTo('withPrimeVueComponents')
    expect(bootstrapper).to.respondTo('withGlobalClickHandler')
    expect(bootstrapper).to.respondTo('bootstrap')
  })
})
