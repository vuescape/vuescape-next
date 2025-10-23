import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import type { NotificationMessage } from '../../models/NotificationMessage'
import { NotificationSeverity } from '../../models/NotificationSeverity'
import NotificationMessages from '../NotificationMessages.vue'

// Mock the useToast composable
const mockToast = {
  add: vi.fn()
}

vi.mock('primevue/usetoast', () => ({
  useToast: () => mockToast
}))

const createWrapper = (messages: Array<NotificationMessage>) => {
  return mount(NotificationMessages, {
    props: {
      messages
    },
    global: {
      plugins: [PrimeVue, ToastService],
      components: { Toast },
      stubs: {
        Toast: true // Stub the Toast component to avoid teleport issues
      }
    }
  })
}

describe('NotificationMessages.vue', () => {
  const mockMessages: Array<NotificationMessage> = [
    { id: '1', text: 'First Message', severity: NotificationSeverity.Info, closeable: true },
    { id: '2', text: 'Second Message', severity: NotificationSeverity.Warning, closeable: true },
    { id: '3', text: 'Third Message', severity: NotificationSeverity.Error, closeable: false }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays toast for closeable messages and Message components for non-closeable messages', async () => {
    const wrapper = createWrapper(mockMessages)
    
    // Wait for nextTick to ensure onMounted has run
    await wrapper.vm.$nextTick()
    
    // Only closeable messages should create toasts (2 out of 3 messages)
    const closeableMessages = mockMessages.filter(msg => msg.closeable !== false)
    expect(mockToast.add).toHaveBeenCalledTimes(closeableMessages.length)
    
    // Verify the toast options for closeable messages
    closeableMessages.forEach((message, index) => {
      expect(mockToast.add).toHaveBeenNthCalledWith(index + 1, {
        id: message.id,
        severity: message.severity,
        summary: message.text,
        detail: '',
        life: 0, // persistent
        closable: message.closeable,
        group: 'notification-messages'
      })
    })
    
    // Verify non-closeable messages are rendered as Message components
    const messageComponents = wrapper.findAllComponents({ name: 'Message' })
    const nonCloseableMessages = mockMessages.filter(msg => msg.closeable === false)
    expect(messageComponents).toHaveLength(nonCloseableMessages.length)
  })

  it('displays toast for new closeable messages when props change', async () => {
    const wrapper = createWrapper([])
    
    // Wait for initial mount
    await wrapper.vm.$nextTick()
    
    // Clear previous calls
    vi.clearAllMocks()
    
    // Update with new closeable message
    const newMessages = [
      { id: '4', text: 'New Message', severity: NotificationSeverity.Info, closeable: true }
    ]
    
    await wrapper.setProps({ messages: newMessages })
    
    // Verify toast was added for the new closeable message
    expect(mockToast.add).toHaveBeenCalledTimes(1)
    expect(mockToast.add).toHaveBeenCalledWith({
      id: '4',
      severity: NotificationSeverity.Info,
      summary: 'New Message',
      detail: '',
      life: 0,
      closable: true,
      group: 'notification-messages'
    })
  })

  it('does not add duplicate toasts for the same message', async () => {
    const wrapper = createWrapper(mockMessages)
    
    // Wait for initial mount
    await wrapper.vm.$nextTick()
    
    // Clear previous calls
    vi.clearAllMocks()
    
    // Set the same messages again
    await wrapper.setProps({ messages: mockMessages })
    
    // Should not add any new toasts since they're duplicates
    expect(mockToast.add).not.toHaveBeenCalled()
  })

  it('renders non-closeable messages as Message components instead of toasts', async () => {
    const messages = [
      { id: 'test-1', text: 'Test Message', severity: NotificationSeverity.Error, closeable: false }
    ]
    
    const wrapper = createWrapper(messages)
    await wrapper.vm.$nextTick()
    
    // Non-closeable messages should not create toasts
    expect(mockToast.add).not.toHaveBeenCalled()
    
    // Should render as Message component
    const messageComponents = wrapper.findAllComponents({ name: 'Message' })
    expect(messageComponents).toHaveLength(1)
    expect(messageComponents[0].text()).toContain('Test Message')
  })

  it('handles empty messages array', async () => {
    const wrapper = createWrapper([])
    await wrapper.vm.$nextTick()
    
    // Should not call toast.add for empty array
    expect(mockToast.add).not.toHaveBeenCalled()
  })

  it('emits remove event when toast close event is triggered', async () => {
    const wrapper = createWrapper(mockMessages)
    await wrapper.vm.$nextTick()
    
    // Trigger the close event on the Toast component
    const toastComponent = wrapper.findComponent({ name: 'Toast' })
    await toastComponent.vm.$emit('close', { message: { id: '1' } })
    
    // Verify remove event was emitted with correct ID
    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect(wrapper.emitted('remove')?.[0]).toEqual(['1'])
  })

  it('handles mixed closeable and non-closeable messages correctly', async () => {
    const mixedMessages = [
      { id: '1', text: 'Closeable Message', severity: NotificationSeverity.Info, closeable: true },
      { id: '2', text: 'Non-closeable Message', severity: NotificationSeverity.Error, closeable: false },
      { id: '3', text: 'Another Closeable', severity: NotificationSeverity.Warning, closeable: true }
    ]
    
    const wrapper = createWrapper(mixedMessages)
    await wrapper.vm.$nextTick()
    
    // Should create 2 toasts for closeable messages
    expect(mockToast.add).toHaveBeenCalledTimes(2)
    
    // Should render 1 Message component for non-closeable message
    const messageComponents = wrapper.findAllComponents({ name: 'Message' })
    expect(messageComponents).toHaveLength(1)
    expect(messageComponents[0].text()).toContain('Non-closeable Message')
  })
})
