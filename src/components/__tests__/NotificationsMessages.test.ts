import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import NotificationMessages from '../NotificationMessages.vue'
import Message from 'primevue/message'
import type { NotificationMessage} from '../../models';
import { NotificationSeverity } from '../../models'
import PrimeVue from 'primevue/config'

const createWrapper = (messages: Array<NotificationMessage>) => {
  return mount(NotificationMessages, {
    props: {
      messages
    },
    global: {
      plugins: [PrimeVue],
      components: { Message }
    }
  })
}

describe('NotificationMessage.vue', () => {
  const mockMessages: Array<NotificationMessage> = [
    { id: '1', text: 'First Message', severity: NotificationSeverity.Info, closeable: true },
    { id: '2', text: 'Second Message', severity: NotificationSeverity.Warning, closeable: true },
    { id: '3', text: 'Third Message', severity: NotificationSeverity.Error, closeable: false }
  ]

  it('renders a list of messages', () => {
    const wrapper = createWrapper(mockMessages)

    const renderedMessages = wrapper.findAllComponents(Message)
    expect(renderedMessages).toHaveLength(mockMessages.length)

    // Check if the text content matches the message prop
    renderedMessages.forEach((msgWrapper, idx) => {
      expect(msgWrapper.text()).toContain(mockMessages[idx].text)
    })
  })

  it('emits remove event when a message is closed', async () => {
    const wrapper = createWrapper(mockMessages)

    const renderedMessages = wrapper.findAllComponents(Message)

    // Trigger the close event on the first message
    renderedMessages[0].vm.$emit('close', new Event('close'))

    // Ensure the remove event is emitted with the correct id
    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect(wrapper.emitted('remove')?.[0]).toEqual(['1'])
  })

  it('does not emit remove event when message is not closeable', async () => {
    const wrapper = createWrapper(mockMessages)

    const renderedMessages = wrapper.findAllComponents(Message)

    // Try closing the third message which is not closeable
    renderedMessages[2].vm.$emit('close', new Event('close'))

    // Ensure the remove event is not emitted
    expect(wrapper.emitted('remove')).toBeFalsy()
  })

  it('updates the list of messages when prop changes', async () => {
    const wrapper = createWrapper(mockMessages)

    // Update the messages prop with a new list of messages
    const newMessages = [
      { id: '4', text: 'Fourth Message', severity: NotificationSeverity.Info, closeable: true }
    ]

    await wrapper.setProps({ messages: newMessages })

    // Check if the messages have been updated correctly
    const renderedMessages = wrapper.findAllComponents(Message)
    expect(renderedMessages).toHaveLength(newMessages.length)
    expect(renderedMessages[0].text()).toContain(newMessages[0].text)
  })
})
