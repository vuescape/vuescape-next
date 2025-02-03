import { useRouter, useRoute } from 'vue-router'

/**
 * Provides a utility for managing route parameters and query values with type safety.
 * 
 * This function allows for easy synchronization of route props with application state,
 * ensuring changes to the route are reflected in the URL and vice versa.
 *
 * @template T - The type of the route props, defined as a record of string keys and their corresponding value types.
 *
 * @param [initialState] - Optional initial state to populate the route parameters and query.
 *                                      If provided, it updates the route with the initial state upon initialization.
 * 
 * @returns {{
*   updateRouteProps: (updates: Partial<T>) => void;
* }} An object containing utility functions for working with route props:
* 
* - `updateRouteProps(updates: Partial<T>)`: Updates the route parameters and query with the provided values.
*                                            Only modifies the route if there are actual changes.
*/
export function useRouteProps<T extends Record<string, any>>(initialState?: Partial<T>) {
  const router = useRouter()
  const route = useRoute()

  // Function to update route params and query
  const updateRouteProps = (updates: Partial<T>) => {
    const newParams = { ...route.params }
    const newQuery = { ...route.query }

    Object.entries(updates).forEach(([key, value]) => {
      if (key in route.params) {
        newParams[key] = value
      } else {
        newQuery[key] = value
      }
    })

    // Only push if there are actual changes
    if (!isEqual(route.params, newParams) || !isEqual(route.query, newQuery)) {
      router.push({ params: newParams, query: newQuery })
    }
  }

  // Utility to extract matching keys from a source object
  // const extractKeys = (source: Partial<T>, reference: Record<string, any>) => {
  //   const result: Record<string, any> = {}
  //   for (const key in source) {
  //     if (key in reference) {
  //       result[key] = source[key]
  //     }
  //   }
  //   return result
  // }

  // Utility to compare two objects shallowly
  const isEqual = (obj1: Record<string, any>, obj2: Record<string, any>) => {
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) return false
    return keys1.every((key) => obj1[key] === obj2[key])
  }

  // Initialize state if provided
  if (initialState) {
    updateRouteProps(initialState)
  }

  return {
    updateRouteProps
  }
}
