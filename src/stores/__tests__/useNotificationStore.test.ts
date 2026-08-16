import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import type { NotificationMessage } from '../../models/NotificationMessage'
import { NotificationSeverity } from '../../models/NotificationSeverity'
import { useNotificationStore } from '../useNotificationStore'

describe('useNotificationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with no messages', () => {
    const store = useNotificationStore()
    expect(store.messages).toEqual([])
  })

  describe('addMessage', () => {
    it('adds a message to the store', () => {
      // Arrange
      const systemUnderTest = useNotificationStore()
      const message: NotificationMessage = {
        id: '1',
        text: 'Something went wrong.',
        severity: NotificationSeverity.Error
      }

      // Act
      systemUnderTest.addMessage(message)

      // Assert
      expect(systemUnderTest.messages).toEqual([message])
    })

    it('does not add a message when one with the same text and severity already exists', () => {
      // Arrange
      const systemUnderTest = useNotificationStore()
      systemUnderTest.addMessage({
        id: '1',
        text: 'Something went wrong.',
        severity: NotificationSeverity.Error
      })

      // Act
      systemUnderTest.addMessage({
        id: '2',
        text: 'Something went wrong.',
        severity: NotificationSeverity.Error
      })

      // Assert
      expect(systemUnderTest.messages).toHaveLength(1)
      expect(systemUnderTest.messages[0].id).toBe('1')
    })

    it('adds a message with the same text but a different severity', () => {
      // Arrange
      const systemUnderTest = useNotificationStore()
      systemUnderTest.addMessage({
        id: '1',
        text: 'Something went wrong.',
        severity: NotificationSeverity.Error
      })

      // Act
      systemUnderTest.addMessage({
        id: '2',
        text: 'Something went wrong.',
        severity: NotificationSeverity.Warning
      })

      // Assert
      expect(systemUnderTest.messages).toHaveLength(2)
    })

    it('adds a duplicate message again after the original has been removed', () => {
      // Arrange
      const systemUnderTest = useNotificationStore()
      const message: NotificationMessage = {
        id: '1',
        text: 'Something went wrong.',
        severity: NotificationSeverity.Error
      }
      systemUnderTest.addMessage(message)
      systemUnderTest.messages.splice(0, 1)

      // Act
      systemUnderTest.addMessage({ ...message, id: '2' })

      // Assert
      expect(systemUnderTest.messages).toHaveLength(1)
      expect(systemUnderTest.messages[0].id).toBe('2')
    })
  })
})
