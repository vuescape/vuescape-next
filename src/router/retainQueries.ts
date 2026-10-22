import type { Router } from 'vue-router'
import { getRetainConfig, useRetainQueryStore } from '../stores/useRetainQueryStore'

interface RetainOptions {
  blocklist?: string[]
}

/**
 * Installs navigation guards on the provided Vue Router instance to retain and restore query parameters
 * (and optionally path params) for specific routes based on the `meta.retain` configuration.
 *
 * This function adds a `beforeEach` guard to restore saved query parameters when navigating to routes
 * with `meta.retain` configured, and an `afterEach` guard to save query parameters after navigation.
 *
 * @param router - The Vue Router instance to install the guards on.
 * @param opts - Optional configuration for retaining queries.
 * @param opts.blocklist - An array of query parameter keys to exclude from being saved/restored.
 *
 * @remarks
 * - Routes opt in by defining `meta.retain.scope` function.
 * - Routes can also list path params in `meta.retain.params`; a navigation that leaves one out gets the last value
 *   seen in the same scope, whether or not it has a query of its own.
 * - If the route's query contains `retain=no`, query and param retention are skipped.
 * - To prevent restore loops, an in-memory flag is used during a synthetic `router.replace` triggered by the guard.
 * - Uses a store (via `useRetainQueryStore`) to persist and retrieve query parameters.
 *
 * @example
 * ```ts
 * // Route definition
 * {
 *   path: '/product/:productId',
 *   name: 'ProductView',
 *   meta: {
 *     retain: {
 *       scope: (route) => route.params.productId as string
 *     }
 *   }
 * }
 * ```
 */
export function installRetainQueryGuards(router: Router, opts: RetainOptions = {}) {
  // Module-scoped counter to suppress re-entrant restores from our own replace().
  // Using a counter (not boolean) is safer for nested/edge scenarios.
  let restoring = 0

  router.beforeEach((to) => {
    // Route must opt in via meta.retain
    const retainConfig = getRetainConfig(to)
    if (!retainConfig) {
      return true
    }

    // Per-hop opt-out
    if (to.query.retain === 'no') {
      return true
    }

    // If we're already in the middle of a restore-triggered replace, skip
    if (restoring > 0) {
      return true
    }

    const store = useRetainQueryStore()

    // Respect explicit query provided by the navigation
    const savedQuery = Object.keys(to.query).length > 0 ? undefined : store.restore(to)
    // Params the navigation left out (one it includes always wins)
    const savedParams = store.restoreParams(to)
    if (!savedQuery && !savedParams) {
      return true
    }

    // Inject retained query and params via replace to keep history clean
    restoring++
    return router.replace({
      name: to.name ?? undefined,
      params: { ...to.params, ...savedParams },
      query: savedQuery ? { ...savedQuery } : to.query,
      hash: to.hash
    })
  })

  router.afterEach((to, from) => {
    // End any restore cycle (if one was in-flight)
    if (restoring > 0) {
      restoring--
    }

    // Only save for routes that opted in
    const retainConfig = getRetainConfig(to)
    if (!retainConfig) {
      return
    }

    // Skip saving when either side explicitly opts out
    if (to.query.retain === 'no' || from.query.retain === 'no') {
      return
    }

    const store = useRetainQueryStore()
    store.save(to, opts.blocklist)
  })
}
