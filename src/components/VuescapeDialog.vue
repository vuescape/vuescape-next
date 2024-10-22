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
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import type { VuescapeDialogProps } from '../models/componentProps/VuescapeDialogProps'

withDefaults(defineProps<VuescapeDialogProps>(), {
  closable: true,
  draggable: false,
  okButtonText: 'OK',
  showFooter: true
})

const emit = defineEmits(['update:visible'])

const okClick = () => {
  emit('update:visible', false)
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
      class="vuescape-dialog__pv-dialog-header--color"
      modal
    >
      <slot />
      <Divider v-if="showFooter" style="margin-bottom: 0" />
      <template v-if="showFooter" #footer>
        <slot name="footer">
          <Button :label="okButtonText" type="button" @click="okClick"></Button>
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
</style>
