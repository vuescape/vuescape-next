<script lang="ts">
/**
 * ButtonComponentRenderer @component
 *
 * This is a Vue Single File Component (SFC) that renders a server-driven button (component.button) and dispatches its
 * action when clicked. VuescapeButton is the plain UI button for use in views; this wraps PrimeVue's Button directly so
 * it can be sized to match ActionButton.
 *
 * @prop {ButtonComponentPayload} - the button component payload
 */
export default {}
</script>

<script setup lang="ts">
import Button from 'primevue/button'
import { computed } from 'vue'
import type { ButtonComponentPayload } from '../models/dynamic-ui/pane-components/ButtonComponentPayload'
import { handleActionEvent } from '../models/dynamic-ui/actions/ActionHandlers'
import { useActionStore } from '../stores/useActionStore'

const props = defineProps<ButtonComponentPayload>()
const actionStore = useActionStore()

const icon = computed(() => props.icons?.join(' '))

const handleClick = (event: Event) => {
  // Dispatch to the action store rather than handling the action here; the page's watcher processes it.
  handleActionEvent(event, props.action, actionStore)
}
</script>

<template>
  <span class="button-component" :title="props.tooltip">
    <!-- The tooltip is on the wrapper because a disabled button gets no mouse events, so its own title would not show. -->
    <Button
      class="button-component__button"
      :label="props.label"
      :icon="icon"
      iconPos="left"
      :disabled="props.isDisabled ?? false"
      @click="handleClick"
    />
  </span>
</template>

<style scoped>
.button-component {
  display: inline-flex;
}

/* Matches ActionButton, so buttons line up with action buttons in tables. TODO: Add this to the theme */
.button-component__button {
  font-size: 14px;
  line-height: 1;
  height: 26px;
}

/* Flex centering centers the font's ascent/descent box, and Segoe UI's tall ascent leaves the
   glyphs ~2px low. Trimming the label to cap-height/baseline centers the visible text instead. */
.button-component__button :deep(.p-button-label) {
  text-box: trim-both cap alphabetic;
}
</style>
