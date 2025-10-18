import type { RouteLocationNormalized, Router } from 'vue-router'

export interface BreadcrumbItem {
  label: string
  path: string
  clickable: boolean
}

export interface BreadcrumbMeta {
  label: string | ((route: any) => string)
  clickable?: boolean
}

/**
 * Simple function to compute breadcrumbs for a given route
 * No Vue context required - just pass in the route and router
 */
export function computeBreadcrumbs(route: RouteLocationNormalized, router: Router): BreadcrumbItem[] {
  const result: BreadcrumbItem[] = []

  // Check if route is valid
  if (!route || !route.path) {
    return result
  }

  // Since route.matched only contains the current route, we need to manually build the hierarchy
  // by walking up the path segments and using Vue Router's resolver to find matching routes
  const currentPath = route.path
  const pathSegments = currentPath.split('/').filter((segment: string) => segment !== '')

  // Walk up the path hierarchy from root to current
  // Only check meaningful path segments that are likely to have breadcrumb metadata
  const meaningfulSegments = []
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i]
    // Skip numeric segments (IDs) and very short segments that are likely parameters
    if (!/^\d+$/.test(segment) && segment.length > 2) {
      meaningfulSegments.push(i)
    }
  }
  
  // Always include the root and the full path
  const segmentsToCheck = [0, ...meaningfulSegments, pathSegments.length]
  
  for (const i of segmentsToCheck) {
    const pathToCheck = i === 0 ? '/' : '/' + pathSegments.slice(0, i).join('/')

    // Try to find a route that matches this path using Vue Router's resolver
    let matchedRoute = null
    try {
      // First try to resolve using the current path structure
      const resolved = router.resolve(pathToCheck)
      if (resolved.matched && resolved.matched.length > 0) {
        matchedRoute = resolved.matched[resolved.matched.length - 1] // Get the deepest match
      }
    } catch {
      // If resolve fails, try to find a route by pattern matching
      const allRoutes = router.getRoutes()
      for (const routeDef of allRoutes) {
        if (routeDef.path === pathToCheck) {
          matchedRoute = routeDef
          break
        }
        // Try pattern matching for dynamic routes
        if (routeDef.path.includes(':')) {
          const pattern = routeDef.path
            .replace(/\//g, '\\/')
            .replace(/:\w+\?/g, '(?:/[^/]+)?')
            .replace(/:\w+/g, '[^/]+')

          const regex = new RegExp(`^${pattern}$`)
          if (regex.test(pathToCheck)) {
            matchedRoute = routeDef
            break
          }
        }
      }
    }

    if (matchedRoute && matchedRoute.meta?.breadcrumb) {
      const breadcrumbMeta = matchedRoute.meta.breadcrumb as BreadcrumbMeta

      let label: string

      // Handle function-based labels (for dynamic content)
      if (typeof breadcrumbMeta.label === 'function') {
        label = breadcrumbMeta.label(route)
      } else {
        label = breadcrumbMeta.label || (matchedRoute.name as string) || 'Unknown'
      }

      // Generate the actual path for this breadcrumb
      let actualPath: string
      try {
        const resolved = router.resolve({
          name: matchedRoute.name,
          params: route.params,
          query: route.query
        })
        actualPath = resolved.path
      } catch {
        // Fallback to manual path construction
        actualPath = matchedRoute.path

        // Replace params with actual values from current route
        if (route.params) {
          Object.keys(route.params).forEach((key) => {
            const paramValue = route.params[key]
            if (paramValue) {
              actualPath = actualPath.replace(`:${key}`, paramValue as string)
            }
          })
        }

        // Replace optional params (like :entityId?)
        actualPath = actualPath.replace(/:\w+\?/g, '')

        // Clean up any remaining :param patterns
        actualPath = actualPath.replace(/:\w+/g, '')

        // Remove double slashes and trailing slashes
        actualPath = actualPath.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
      }

      // Determine if this breadcrumb should be clickable
      // The last breadcrumb (current page) should not be clickable
      // Previous breadcrumbs should be clickable unless explicitly set to false
      const isLastBreadcrumb = i === pathSegments.length
      const shouldBeClickable = !isLastBreadcrumb && breadcrumbMeta.clickable !== false

      result.push({
        label,
        path: actualPath,
        clickable: shouldBeClickable
      })
    }
  }

  return result
}
