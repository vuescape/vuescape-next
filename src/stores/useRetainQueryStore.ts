/**
 * Pinia store for retaining and restoring query parameters across route navigations.
 *
 * This store allows you to save, restore, and clear query parameters for Vue Router routes,
 * using multiple keying strategies (exact match, group, route name, and path prefix).
 * It is useful for preserving user state (such as filters or search queries) when navigating
 * between pages or returning to a previous route.
 *
 * @remarks
 * - Uses a shallowRef-wrapped Map to store sanitized query objects keyed by route variants.
 * - Query parameters can be selectively excluded from retention using a blocklist.
 * - Supports grouping and prefix-based retention via route meta and path heuristics.
 *
 * @example
 * ```ts
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
 * The default list of query parameter keys to exclude (blocklist) when retaining query parameters.
 *
 * @remarks
 * This array contains the names of query parameters that should not be retained
 * across navigation or state changes. By default, it includes the `'retain'` key.
 */
const DEFAULT_BLOCKLIST = ['retain']

/**
 * Removes properties from the given query object (`q`) whose keys are present in the `blocklist`
 * or whose values are `undefined`. Returns a new object with the remaining key-value pairs.
 *
 * @template Q - The type of the query object.
 * @param q - The query object to sanitize.
 * @param blocklist - An array of keys to exclude from the result. Defaults to `DEFAULT_BLOCKLIST`.
 * @returns A new query object with excluded keys and undefined values removed.
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
 * Generates a unique string key for a given route based on its name and sorted parameters.
 *
 * @param r - The route object of type `RouteLocationNormalized` to generate the key from.
 * @returns A string in the format `exact::<routeName>::<sortedParam1>:<value1>|<sortedParam2>:<value2>|...`
 *          where routeName is the route's name (or 'unknown' if not present), and parameters are sorted alphabetically.
 */
function exactKey(r: RouteLocationNormalized) {
  const name = String(r.name ?? 'unknown')
  const params = Object.keys(r.params)
    .sort()
    .map((k) => `${k}:${String((r.params as any)[k])}`)
    .join('|')
  return `exact::${name}::${params}`
}

/**
 * Generates a unique key string for a given route based on its name property.
 *
 * @param r - The route object of type `RouteLocationNormalized`.
 * @returns A string in the format `name::<routeName>`, where `<routeName>` is the route's name or 'unknown' if the name is not defined.
 */
function nameKey(r: RouteLocationNormalized) {
  return `name::${String(r.name ?? 'unknown')}`
}

/**
 * Generates a group key string based on the `retainGroup` property in the route's meta object.
 *
 * @param r - The normalized route location object.
 * @returns A string in the format `group::<retainGroup>` if `retainGroup` is a non-empty string after trimming,
 *          otherwise returns `undefined`.
 */
function groupKey(r: RouteLocationNormalized) {
  const g = (r.meta?.retainGroup as string | undefined)?.trim()
  return g ? `group::${g}` : undefined
}

/**
 * Generates a prefixed key based on the first static segment of the top-level route record.
 *
 * @param r - The normalized route location object.
 * @returns A string in the format `prefix::<segment>` if a segment exists, otherwise `undefined`.
 */
function prefixKey(r: RouteLocationNormalized) {
  // Heuristic fallback: first static segment of the top-level record
  const top = r.matched[0]?.path ?? r.path
  const seg = top.split('/').filter(Boolean)[0]
  return seg ? `prefix::${seg}` : undefined
}

function keyVariants(r: RouteLocationNormalized) {
  const keys = [exactKey(r)]
  const gk = groupKey(r)
  if (gk) {
    keys.push(gk)
  }

  keys.push(nameKey(r))
  const pk = prefixKey(r)
  if (pk) {
    keys.push(pk)
  }
  return keys
}

/**
 * Pinia store for retaining and restoring query parameters associated with Vue Router routes.
 *
 * This store allows you to save, restore, and clear query parameter objects keyed by route variants.
 * It uses a shallowRef-wrapped Map to efficiently manage and reactively update stored queries.
 *
 * @remarks
 * - Uses shallowRef to avoid deep reactivity issues with Map.
 * - Clones the Map on writes to ensure Vue reactivity.
 *
 * @returns An object containing:
 * - `map`: The reactive Map of stored queries.
 * - `save(route, blocklist?)`: Saves the sanitized query for the given route, optionally omitting blocklisted keys.
 * - `restore(route)`: Restores the stored query for the given route, if any.
 * - `clear()`: Clears all stored queries.
 */
export const useRetainQueryStore = defineStore('retainQuery', () => {
  // Use shallowRef to avoid deep proxying of Map; clone on writes to trigger reactivity.
  const map = shallowRef(new Map<string, Q>())

  function setMap(mutator: (m: Map<string, Q>) => void) {
    const next = new Map(map.value)
    mutator(next)
    map.value = next
  }

  function save(route: RouteLocationNormalized, blocklist?: string[]) {
    const cleaned = sanitizeQuery(route.query as Q, blocklist)
    const keys = keyVariants(route)

    if (Object.keys(cleaned).length === 0) {
      setMap((m) => {
        keys.forEach((k) => m.delete(k))
      })
    } else {
      setMap((m) => {
        keys.forEach((k) => m.set(k, cleaned))
      })
    }
  }

  function restore(route: RouteLocationNormalized): Q | undefined {
    const keys = keyVariants(route)
    for (const k of keys) {
      const hit = map.value.get(k)
      if (hit) return hit
    }
    return undefined
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
