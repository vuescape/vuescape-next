/**
 * Represents the event types emitted by a Wizard component.
 *
 * @template Props - The type of the properties associated with the `update` event.
 *
 * @property update - Event emitted when the wizard's state is updated.
 *                     Contains an array with the updated properties of type `Props`.
 * @property 'can-continue' - Event emitted to indicate whether the wizard can proceed
 *                            to the next step. Contains a boolean value.
 */
export type WizardComponentEmits<Props> = {
  update: [Props]
  'can-continue': [boolean]
}
