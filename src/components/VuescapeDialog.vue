<script lang="ts" setup>
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false,
  },
  headerText: {
    type: String,
    required: true,
  },
  closable: {
    type: Boolean,
    required: false,
    default: true,
  },
  draggable: {
    type: Boolean,
    required: false,
    default: false,
  },
  okButtonText: {
    type: String,
    required: false,
    default: 'OK',
  },
  showFooter: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const emit = defineEmits(['update:visible'])

const okClick = () => {
  emit('update:visible', false)
}

</script>

<template>
  <div class="card flex">
    <Dialog :closable="closable"
            :dismissable-mask="closable"
            :draggable="draggable"
            :header="headerText"
            :style="{ width: '25rem' }"
            :visible="modelValue"
            class="vuescape-dialog__pv-dialog-header--color"
            modal
    >
      <slot />
      <Divider v-if="showFooter" style="margin-bottom: 0;" />
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
