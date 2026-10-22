import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import type { RouteLocationNormalized, Router } from 'vue-router'
import { createMemoryHistory, createRouter } from 'vue-router'

import { installRetainQueryGuards } from '../retainQueries'

const Stub = defineComponent({ render: () => null })

function createTestRouter(): Router {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: Stub },
      {
        path: '/product/:productId/:entityId?',
        name: 'product',
        component: Stub,
        meta: {
          retain: {
            scope: (route: RouteLocationNormalized) => route.params.productId as string,
            params: ['entityId'],
          },
        },
      },
      {
        path: '/report/:reportId/:entityId?',
        name: 'report',
        component: Stub,
        meta: { retain: { scope: (route: RouteLocationNormalized) => route.params.reportId as string } },
      },
    ],
  })

  installRetainQueryGuards(router)
  return router
}

describe('installRetainQueryGuards', () => {
  let systemUnderTest: Router

  beforeEach(async () => {
    setActivePinia(createPinia())
    systemUnderTest = createTestRouter()
    await systemUnderTest.push('/')
  })

  describe('params', () => {
    it('should restore a retained param the navigation left out', async () => {
      // Arrange
      await systemUnderTest.push('/product/p1/e2')
      await systemUnderTest.push('/')

      // Act
      await systemUnderTest.push('/product/p1')

      // Assert
      expect(systemUnderTest.currentRoute.value.fullPath).toBe('/product/p1/e2')
    })

    it('should keep a param the navigation includes, and retain it instead', async () => {
      // Arrange
      await systemUnderTest.push('/product/p1/e2')

      // Act
      await systemUnderTest.push('/product/p1/e3')
      await systemUnderTest.push('/')
      await systemUnderTest.push('/product/p1')

      // Assert
      expect(systemUnderTest.currentRoute.value.fullPath).toBe('/product/p1/e3')
    })

    it('should retain params per scope', async () => {
      // Arrange
      await systemUnderTest.push('/product/p1/e2')

      // Act
      await systemUnderTest.push('/product/p2')

      // Assert
      expect(systemUnderTest.currentRoute.value.fullPath).toBe('/product/p2')
    })

    it('should restore a param alongside an explicit query, keeping that query', async () => {
      // Arrange
      await systemUnderTest.push('/product/p1/e2?tab=a')
      await systemUnderTest.push('/')

      // Act
      await systemUnderTest.push('/product/p1?tab=b')

      // Assert
      expect(systemUnderTest.currentRoute.value.fullPath).toBe('/product/p1/e2?tab=b')
    })

    it('should restore the retained query and param together', async () => {
      // Arrange
      await systemUnderTest.push('/product/p1/e2?tab=a')
      await systemUnderTest.push('/')

      // Act
      await systemUnderTest.push('/product/p1')

      // Assert
      expect(systemUnderTest.currentRoute.value.fullPath).toBe('/product/p1/e2?tab=a')
    })

    it('should not restore when the navigation opts out', async () => {
      // Arrange
      await systemUnderTest.push('/product/p1/e2')
      await systemUnderTest.push('/')

      // Act
      await systemUnderTest.push('/product/p1?retain=no')

      // Assert
      expect(systemUnderTest.currentRoute.value.fullPath).toBe('/product/p1?retain=no')
    })

    it('should not restore params the route does not list', async () => {
      // Arrange
      await systemUnderTest.push('/report/r1/e2')
      await systemUnderTest.push('/')

      // Act
      await systemUnderTest.push('/report/r1')

      // Assert
      expect(systemUnderTest.currentRoute.value.fullPath).toBe('/report/r1')
    })
  })
})
