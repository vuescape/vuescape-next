import type { NotificationSeverity } from './NotificationSeverity'

export interface NotificationMessage {
  id: string
  severity: NotificationSeverity
  text: string
  closeable?: boolean
}
