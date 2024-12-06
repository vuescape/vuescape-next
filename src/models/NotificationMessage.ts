import type { NotificationSeverity } from './NotificationSeverity'

/**
 * Represents a notification message.
 *
 * @interface NotificationMessage
 */
export interface NotificationMessage {
  /**
   * Unique identifier for the notification message.
   */
  id: string

  /**
   * Severity level of the notification message.
   */
  severity: NotificationSeverity

  /**
   * Text content of the notification message.
   */
  text: string

  /**
   * Indicates whether the notification message can be closed.
   * Optional.
   */
  closeable?: boolean
}
