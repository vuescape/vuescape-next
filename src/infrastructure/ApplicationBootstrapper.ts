// TODO: Remove ignore when working
import { NullTrackingService, type TrackingService } from '../analytics'
import type { AppComponentProps } from '../components/AppComponentProps'
import type { BootstrappedComponent } from '../components/BootstrappedComponent'

import LoadingDirective from '../directives/loading.ts'
// import { Axios, CacheOptions } from '../http'
// import { setStore } from '../store'
// import { ModuleState, StoreModule } from '../store/modules/types'
// import { RootState } from '../store/RootState'
import { type FeatureService, type InitFunctionResult, NullFeatureService } from '../types'

// TODO: how to handle resize in vue 3? check VueUse for a composable
// import 'vue-resize/dist/vue-resize.css'
import type { ErrorHandler } from '../types/ErrorHandler'
// @ts-ignore-once: TS6133
import { type Pinia } from 'pinia'

import PrimeVue from 'primevue/config'
import { type ComponentPublicInstance, createApp } from 'vue'
// tslint:disable: member-ordering
import type { Router } from 'vue-router'

/**
 * Application Bootstrapper is responsible for setting up and initializing the application.
 * It provides methods to configure various aspects of the application such as the router, error handler, tracking service, feature service, and more.
 * It also includes a method to bootstrap the application which validates the configuration, initializes the application, and handles any errors that occur during initialization.
 */
export class ApplicationBootstrapper {
  private theme: any = {}

  private errorHandler!: ErrorHandler
  // private storeModules                     = {}
  // private vuexStore: Store<any>
  private router!: Router
  private rootComponentOptions!: { cssSelector: string; rootComponent: BootstrappedComponent }
  private bootstrappedHeaderComponent!: BootstrappedComponent
  private bootstrappedFooterComponent!: BootstrappedComponent
  private navigationComponent?: BootstrappedComponent
  private additionalAppComponents?: Array<BootstrappedComponent>
  private trackingService: TrackingService = new NullTrackingService()
  private featureService: FeatureService = new NullFeatureService()
  private globalClickHandler!: (e: MouseEvent) => void

  private piniaStore!: Pinia

  /**
   * Sets the initialization function for the application.
   * The initialization function is expected to return a promise that resolves to an `InitFunctionResult`.
   *
   * @param initFunction - The initialization function.
   * @returns The `ApplicationBootstrapper` instance.
   */
  public withInit(initFunction: () => Promise<InitFunctionResult | undefined>) {
    this.initFunction = initFunction
    return this
  }

  /**
   * Sets the Pinia store for the application.
   * Pinia is a state management library for Vue.js.
   *
   * @param piniaStore - The Pinia store.
   * @returns The `ApplicationBootstrapper` instance.
   */
  public withPinia(piniaStore: Pinia) {
    this.piniaStore = piniaStore
    return this
  }

  /**
   * Sets the error handler for the application.
   * The error handler is a function that handles any errors that occur during the application's lifecycle.
   *
   * @param errorHandler - The error handler.
   * @returns The `ApplicationBootstrapper` instance.
   */
  public withErrorHandler(errorHandler: ErrorHandler) {
    this.errorHandler = errorHandler
    return this
  }

  /**
   * Sets the router for the application.
   *
   * @param router - The router.
   * @returns The `ApplicationBootstrapper` instance.
   */
  public withRouter(router: Router) {
    this.router = router
    return this
  }

  /**
   * Sets the tracking service for the application.
   *
   * @param trackingService - The tracking service.
   * @returns The `ApplicationBootstrapper` instance.
   */
  public withTrackingService(trackingService: TrackingService) {
    this.trackingService = trackingService
    return this
  }

  /**
   * Sets the feature service for the application.
   *
   * @param featureService - The feature service.
   * @returns The `ApplicationBootstrapper` instance.
   */
  public withFeatureService(featureService: FeatureService) {
    this.featureService = featureService
    return this
  }

  // public withIconfont(iconFont: string) {
  //   this.iconfont = iconFont
  //   return this
  // }

  /**
   * Sets the navigation component for the application.
   *
   * @param navigationComponent - The navigation component.
   * @returns The `ApplicationBootstrapper` instance.
   */
  public withNavigationComponent(navigationComponent: BootstrappedComponent) {
    this.navigationComponent = navigationComponent
    return this
  }

  /**
   * Sets the additional components for the application.
   *
   * @param additionalAppComponents - The additional components.
   * @returns The `ApplicationBootstrapper` instance.
   */
  public withAdditionalComponents(additionalAppComponents: Array<BootstrappedComponent>) {
    this.additionalAppComponents = additionalAppComponents
    return this
  }

  /**
   * Sets the root component for the application.
   *
   * @param cssSelector - The CSS selector.
   * @param bootstrappedComponent - The root component to bootstrap.
   * @returns The `ApplicationBootstrapper` instance.
   */
  public withRootComponent(cssSelector: string, bootstrappedComponent: BootstrappedComponent) {
    this.rootComponentOptions = {
      cssSelector,
      rootComponent: bootstrappedComponent,
    }
    return this
  }

  /**
   * Sets the root component for the application.
   *
   * @param bootstrappedHeaderComponent - The header component to bootstrap.
   * @returns The `ApplicationBootstrapper` instance.
   */
  public withHeaderComponent(bootstrappedHeaderComponent: BootstrappedComponent) {
    this.bootstrappedHeaderComponent = bootstrappedHeaderComponent
    return this
  }

  /**
   * Sets the root component for the application.
   *
   * @param bootstrappedFooterComponent - The header component to bootstrap.
   * @returns The `ApplicationBootstrapper` instance.
   */
  public withFooterComponent(bootstrappedFooterComponent: BootstrappedComponent) {
    this.bootstrappedFooterComponent = bootstrappedFooterComponent
    return this
  }

  /**
   * Sets the root component for the application.
   *
   * @param theme - The PrimeVue theme to use. This includes a theme preset as well as options.
   * @returns The `ApplicationBootstrapper` instance.
   */
  public withTheme(theme: any) {
    this.theme = theme
    return this
  }

  /**
   * Sets the global click handler for the application.
   *
   * @param handler - The handler.
   * @returns The `ApplicationBootstrapper` instance.
   */
  public withGlobalClickHandler(handler: (e: MouseEvent) => void) {
    this.globalClickHandler = handler
    return this
  }

  /**
   * Bootstraps the application.
   * This method validates the configuration, initializes the application, and handles any errors that occur during initialization.
   * It sets up the Vue application with the configured router, Pinia store, error handler, tracking service, feature service, navigation component, global click handler, and additional components.
   * It also mounts the root component to the specified CSS selector.
   * If the initialization function returns a redirect URL, it redirects the window to that URL.
   * If an error occurs during initialization, it logs the error and its details.
   */
  public async bootstrap() {
    this.validate()

    // Leave resize handling to root component and child components but use vueUse resize composable

    // TODO: Setup theme -- button colors etc. -- should this be done here or in the root component?
    try {
      const rootComponentProps: AppComponentProps = {
        navigationBootstrappedComponent: this.navigationComponent,
        headerBootstrappedComponent: this.bootstrappedHeaderComponent,
        footerBootstrappedComponent: this.bootstrappedFooterComponent,
        trackingService: this.trackingService,
        globalClickHandler: this.globalClickHandler,
        additionalComponents: this.additionalAppComponents,
      }

      // Spread rootComponentProps to satisfy Vue typing
      const app = createApp(this.rootComponentOptions.rootComponent.component, { ...rootComponentProps })
      app.directive('loading', LoadingDirective)

      app.use(this.piniaStore)
      app.config.errorHandler = this.errorHandler || this.defaultErrorHandler
      app.provide('featureService', this.featureService)
      // app.provide('trackingService', this.trackingService)
      // app.provide('navigationComponent', this.navigationComponent)
      // app.provide('globalClickHandler', this.globalClickHandler)
      // app.provide('additionalAppComponents', this.additionalAppComponents)

      const result = await this.initFunction()
      if (result?.redirectUrl) {
        window.location.href = result.redirectUrl
        return
      }

      app.use(PrimeVue, this.theme)

      app.use(this.router)
      app.mount(this.rootComponentOptions.cssSelector)
    } catch (error) {
      const err = error as any
      console.error('catch error handler', error)
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(err.response.data)
        console.error(err.response.status)
        console.error(err.response.headers)
      } else if (err.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.error(err.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error', err.message)
      }
      console.error(err.config)
    }
  }

  private initFunction: () => Promise<InitFunctionResult | undefined> = async () => {
    return { redirectUrl: '' }
  }

  private validate() {
    if (!this.router) {
      console.warn('Router not set in ApplicationBootstrapper. ' + 'Call withRouter() with the router if a router is needed.')
    }
    if (!this.piniaStore) {
      console.warn(
        'Pinia store not defined.  Call withPiniaStore() to set the Pinia Store.')
    }
    if (!this.rootComponentOptions) {
      console.warn('No Vue root component defined.  Call withRootComponent() to set the root component.')
    }
  }

  private defaultErrorHandler = (
    err: unknown,
    instance: ComponentPublicInstance | null,
    // `info` is a Vue-specific error info,
    // e.g. which lifecycle hook the error was thrown in
    info: string,
  ) => {
    console.error(`Vue threw an error.
  Usually this is caused by an error during rendering but could be at any point during the component lifecycle.`)
    console.error(err, instance, info)
  }
}
