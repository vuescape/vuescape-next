import { describe, expect, it } from 'vitest'

import type { WizardGraph } from '../../WizardGraph'
import { createWizardEngine } from '../wizardUtil'

// A linear graph: a → b → c → d
function buildGraph(): WizardGraph {
  const ids = ['a', 'b', 'c', 'd']
  return Object.fromEntries(
    ids.map((id, index) => [id, { id, component: {} as any, next: () => ids[index + 1] ?? null }]),
  ) as WizardGraph
}

function advanceTo(engine: ReturnType<typeof createWizardEngine>, stepId: string) {
  while (engine.currentStepId.value !== stepId) {
    engine.goNext()
  }
}

describe('createWizardEngine', () => {
  describe('goTo', () => {
    it('should go back to a visited step, dropping the steps after it', () => {
      // Arrange
      const systemUnderTest = createWizardEngine(buildGraph(), 'a')
      advanceTo(systemUnderTest, 'd')

      // Act
      systemUnderTest.goTo('b')

      // Assert
      expect(systemUnderTest.currentStepId.value).toBe('b')
      expect(systemUnderTest.context.history).toEqual(['a', 'b'])
    })

    it('should add an unvisited step after the current history', () => {
      const systemUnderTest = createWizardEngine(buildGraph(), 'a')
      advanceTo(systemUnderTest, 'b')

      systemUnderTest.goTo('d')

      expect(systemUnderTest.currentStepId.value).toBe('d')
      expect(systemUnderTest.context.history).toEqual(['a', 'b', 'd'])
    })

    it('should use the given preceding history, so Back returns through it', () => {
      // Arrange
      const systemUnderTest = createWizardEngine(buildGraph(), 'a')
      advanceTo(systemUnderTest, 'd')

      // Act
      systemUnderTest.goTo('c', ['a'])
      systemUnderTest.goBack()

      // Assert
      expect(systemUnderTest.currentStepId.value).toBe('a')
    })

    it('should ignore a step that is not in the graph', () => {
      const systemUnderTest = createWizardEngine(buildGraph(), 'a')
      advanceTo(systemUnderTest, 'c')

      systemUnderTest.goTo('missing')

      expect(systemUnderTest.currentStepId.value).toBe('c')
      expect(systemUnderTest.context.history).toEqual(['a', 'b', 'c'])
    })
  })
})
