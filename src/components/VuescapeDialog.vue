<script lang="ts">
/**
 * VuescapeDialog @component
 *
 * This is a Vue Single File Component (SFC) that renders a modal Dialog
 *
 * @prop {VuescapeDialogProps} - the VuescapeDialogProps
 *
 * @emits {update:visible} - event emitted when the dialog is closed
 *
 * @slot default - the content of the dialog
 * @slot footer - the footer content of the dialog
 */
export default {}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import type { VuescapeDialogProps } from '../models/componentProps/VuescapeDialogProps'

/**
 * This component currently uses a typed event model (e.g. `@change`, `@update`).
 * If this component is later used inside a dynamic wizard or needs to emit
 * `can-continue` or unified `update` events, it may be wrapped in a
 * wizard-specific variant (e.g., `WizardFileUpload.vue`) to keep the core
 * component agnostic of wizard behavior.
 */
const emit = defineEmits(['update:modelValue', 'confirm'])

const props = withDefaults(defineProps<VuescapeDialogProps>(), {
  closable: false,
  draggable: false,
  okButtonText: 'OK',
  cancelButtonText: undefined,
  density: 'comfortable',
  showFooter: true
})

const dialogClass = computed(() => [
  'vuescape-dialog__pv-dialog-header--color',
  { 'vuescape-dialog--compact': props.density === 'compact' }
])

const okClick = () => {
  emit('confirm')
  emit('update:modelValue', false)
}

const cancelClick = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <div class="card flex">
    <Dialog
      :closable="closable"
      :dismissable-mask="closable"
      :draggable="draggable"
      :header="headerText"
      :style="{ width: '25rem' }"
      :visible="modelValue"
      :class="dialogClass"
      modal
    >
      <slot />
      <template v-if="showFooter" #footer>
        <slot name="footer">
          <div class="w-full">
            <Divider class="mb-4 mt-0" />
            <div class="flex justify-end gap-2">
              <Button
                v-if="cancelButtonText"
                :label="cancelButtonText"
                type="button"
                outlined
                @click="cancelClick"
              ></Button>
              <Button :label="okButtonText" type="button" @click="okClick"></Button>
            </div>
          </div>
        </slot>
      </template>
    </Dialog>
  </div>
</template>

<!--suppress CssUnresolvedCustomProperty -->
<style>
.vuescape-dialog__pv-dialog-header--color .p-dialog-header {
  background-color: var(--p-primary-color);
  color: white;
}

.vuescape-dialog__pv-dialog-header--color .p-dialog-content {
  padding-bottom: 0;
}

.vuescape-dialog__pv-dialog-header--color .p-dialog-footer {
  padding-top: 0.25rem;
}

.vuescape-dialog--compact .p-dialog-header {
  padding: 0.5rem 1rem;
}

.vuescape-dialog--compact .p-dialog-footer {
  padding: 0.5rem 1rem;
}
</style>
