import type { NotificationMessage } from '../NotificationMessage'

/**
 * Represents the props for the NotificationMessages component.
 */
export interface NotificationMessagesProps {
  /**
   * An array of notification messages to be displayed.
   */
  messages: Array<NotificationMessage>
}
