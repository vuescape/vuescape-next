import type { Router } from 'vue-router'
import { useRetainQueryStore } from '../stores/useRetainQueryStore'

interface RetainOptions {
  blocklist?: string[]
  includeRouteNames?: Array<string | number | symbol>
}

/**
 * Installs navigation guards on the provided Vue Router instance to retain and restore query parameters
 * for specific routes based on configurable options.
 *
 * This function adds a `beforeEach` guard to restore saved query parameters when navigating to routes
 * marked with `meta.retainQuery`, and an `afterEach` guard to save query parameters after navigation.
 * It supports optional inclusion filtering by route names and allows blocking specific query keys from being saved.
 *
 * @param router - The Vue Router instance to install the guards on.
 * @param opts - Optional configuration for retaining queries.
 * @param opts.includeRouteNames - An array of route names for which query retention should be enabled. If omitted, all routes with `meta.retainQuery` are considered.
 * @param opts.blocklist - An array of query parameter keys to exclude from being saved/restored.
 *
 * @remarks
 * - If the route's query contains `retain=no`, query retention is skipped.
 * - To prevent restore loops, an in-memory flag is used during a synthetic `router.replace` triggered by the guard.
 *   This avoids leaking any internal marker into the URL.
 * - Uses a store (via `useRetainQueryStore`) to persist and retrieve query parameters.
 */
export function installRetainQueryGuards(router: Router, opts: RetainOptions = {}) {
  // Module-scoped counter to suppress re-entrant restores from our own replace().
  // Using a counter (not boolean) is safer for nested/edge scenarios.
  let restoring = 0

  router.beforeEach((to) => {
    // Route must opt in via meta
    if (!to.meta?.retainQuery) {
      return true
    }

    // Per-hop opt-out
    if (to.query.retain === 'no') {
      return true
    }

    // Optional inclusion filter
    if (opts.includeRouteNames && to.name && !opts.includeRouteNames.includes(to.name)) {
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
    if (!to.meta?.retainQuery) {
      return
    }

    // Skip saving when either side explicitly opts out
    if (to.query.retain === 'no' || from.query.retain === 'no') {
      return
    }

    // Optional inclusion filter
    if (opts.includeRouteNames && to.name && !opts.includeRouteNames.includes(to.name)) {
      return
    }

    const store = useRetainQueryStore()
    store.save(to, opts.blocklist)
  })
}
