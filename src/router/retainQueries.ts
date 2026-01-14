import type { Router } from 'vue-router'
import { getRetainConfig, useRetainQueryStore } from '../stores/useRetainQueryStore'

interface RetainOptions {
  blocklist?: string[]
}

/**
 * Installs navigation guards on the provided Vue Router instance to retain and restore query parameters
 * for specific routes based on the `meta.retain` configuration.
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
 * - If the route's query contains `retain=no`, query retention is skipped.
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

    // Respect explicit query provided by the navigation
    if (Object.keys(to.query).length > 0) {
      return true
    }

    // If we're already in the middle of a restore-triggered replace, skip
    if (restoring > 0) {
      return true
    }

    const store = useRetainQueryStore()
    const saved = store.restore(to)
    if (!saved) {
      return true
    }

    // Inject retained query via replace to keep history clean
    restoring++
    return router.replace({
      name: to.name ?? undefined,
      params: to.params,
      query: { ...saved },
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
