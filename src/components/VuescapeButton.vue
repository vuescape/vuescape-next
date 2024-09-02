<script lang="ts" setup>
import Button from 'primevue/button'
import { defineEmits, defineProps } from 'vue'

type IconPosition = 'left' | 'right' | 'top' | 'bottom';

const props = defineProps({
  label: {
    type: String,
    default: 'Submit',
  },
  icon: {
    type: String,
    default: '',
  },
  iconPos: {
    type: String as () => IconPosition,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  class: {
    type: [String, Object],
    default: '',
  },
})

const emit = defineEmits<{
  (e: 'click', event: Event): void;
}>()

// Handle the click event and emit it to the parent
const handleClick = (event: Event) => {
  emit('click', event)
}
</script>

<template>
  <Button
    :class="[props.class, {'vuescape-button--with-icon': props.icon}]"
    :disabled="props.disabled"
    :icon="props.icon"
    :iconPos="props.iconPos"
    :label="props.label"
    @click="handleClick"
  />
</template>

<style scoped>
.vuescape-button--with-icon {
  margin-bottom: 1px;
}
</style>
