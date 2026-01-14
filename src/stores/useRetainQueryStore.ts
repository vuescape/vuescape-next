/**
 * Pinia store for retaining and restoring query parameters across route navigations.
 *
 * This store allows you to save, restore, and clear query parameters for Vue Router routes,
 * using a scope-based keying strategy defined in route meta.
 *
 * @remarks
 * - Uses a shallowRef-wrapped Map to store sanitized query objects keyed by scope.
 * - Query parameters can be selectively excluded from retention using a blocklist.
 * - Scope is defined via `route.meta.retain.scope(route)` function.
 *
 * @example
 * ```ts
 * // In route definition:
 * meta: {
 *   retain: {
 *     scope: (route) => route.params.productId as string
 *   }
 * }
 *
 * // In component:
 * const retainQueryStore = useRetainQueryStore()
 * retainQueryStore.save(route)
 * const restored = retainQueryStore.restore(route)
 * ```
 */
import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'
import { shallowRef } from 'vue'

type Q = Record<string, any>

/**
 * Configuration object for query retention on a route.
 */
export interface RetainConfig {
  /**
   * Function that returns the scope key for this route.
   * The scope determines how query params are keyed in the store.
   * Can return a dynamic value (e.g., route.params.productId) or a constant for group-like behavior.
   */
  scope: (route: RouteLocationNormalized) => string | undefined
}

/**
 * The default list of query parameter keys to exclude (blocklist) when retaining query parameters.
 */
const DEFAULT_BLOCKLIST = ['retain']

/**
 * Removes properties from the given query object (`q`) whose keys are present in the `blocklist`
 * or whose values are `undefined`. Returns a new object with the remaining key-value pairs.
 */
function sanitizeQuery(q: Q, blocklist = DEFAULT_BLOCKLIST): Q {
  const out: Q = {}
  for (const [k, v] of Object.entries(q)) {
    if (blocklist.includes(k) || v === undefined) {
      continue
    }
    out[k] = v
  }
  return out
}

/**
 * Gets the RetainConfig from route meta, if present.
 */
export function getRetainConfig(route: RouteLocationNormalized): RetainConfig | undefined {
  return route.meta?.retain as RetainConfig | undefined
}

/**
 * Generates the storage key for a route based on its retain scope.
 * Returns undefined if retention is not configured or scope returns undefined.
 */
function getRetainKey(route: RouteLocationNormalized): string | undefined {
  const config = getRetainConfig(route)
  if (!config) return undefined

  const scopeValue = config.scope(route)
  if (scopeValue === undefined) return undefined

  const routeName = String(route.name ?? 'unknown')
  return `retain::${routeName}::${scopeValue}`
}

/**
 * Pinia store for retaining and restoring query parameters associated with Vue Router routes.
 *
 * @remarks
 * - Uses shallowRef to avoid deep reactivity issues with Map.
 * - Clones the Map on writes to ensure Vue reactivity.
 *
 * @returns An object containing:
 * - `map`: The reactive Map of stored queries.
 * - `save(route, blocklist?)`: Saves the sanitized query for the given route.
 * - `restore(route)`: Restores the stored query for the given route, if any.
 * - `clear()`: Clears all stored queries.
 */
export const useRetainQueryStore = defineStore('useRetainQuery', () => {
  // Use shallowRef to avoid deep proxying of Map; clone on writes to trigger reactivity.
  const map = shallowRef(new Map<string, Q>())

  function setMap(mutator: (m: Map<string, Q>) => void) {
    const next = new Map(map.value)
    mutator(next)
    map.value = next
  }

  function save(route: RouteLocationNormalized, blocklist?: string[]) {
    const key = getRetainKey(route)
    if (!key) return

    const cleaned = sanitizeQuery(route.query as Q, blocklist)

    if (Object.keys(cleaned).length === 0) {
      setMap((m) => m.delete(key))
    } else {
      setMap((m) => m.set(key, cleaned))
    }
  }

  function restore(route: RouteLocationNormalized): Q | undefined {
    const key = getRetainKey(route)
    if (!key) return undefined

    return map.value.get(key)
  }

  function clear() {
    setMap((m) => m.clear())
  }

  return {
    // state
    map,
    // actions
    save,
    restore,
    clear
  }
})
