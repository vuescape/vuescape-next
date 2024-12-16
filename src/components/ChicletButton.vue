<script lang="ts">
/**
 * ChicletButton @component
 *
 * This is a Vue Single File Component (SFC) that renders a button
 * formatted as a chiclet (square with an icon).
 *
 * @prop {Chiclet} chiclet - The chiclet to be displayed.
 *
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import Button from 'primevue/button'

import type { Chiclet } from '../models/dynamic-ui/Chiclet'
import { handleActionEvent } from '../models/dynamic-ui/actions/ActionHandlers'
import { useActionStore } from '../stores/useActionStore'

/**
 * Props definition for the ChicletButton component.
 *
 * @property {Chiclet} chiclet - The chiclet object containing data for the button.
 */
const props = defineProps<{ chiclet: Chiclet }>()

/**
 * Computed property that returns the icons used in the ChicletButton component.
 */
const icons = computed((event: any) => {
  const result = props.chiclet.icons?.join(' ') ?? ''
  return result
})

const actionStore = useActionStore()
</script>

<template>
  <Button
    v-if="chiclet.isVisible"
    :icon="icons"
    iconPos="top"
    iconClass="chiclet-button__icon"
    :class="['chiclet-button__layout', chiclet.cssClass]"
    @click="handleActionEvent($event, props.chiclet.action, actionStore)"
  />
</template>

<style>
.p-button.chiclet-button__layout {
  width: 160px;
  height: 160px;
  border: 2px solid #eeeeee;
  background-color: #eeeeee;
  margin-top: -10px;
  cursor: pointer;
  color: black;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.p-button.chiclet-button__layout:hover {
  color: black !important;
  background-color: #eeeeee !important;
  border: 2px solid rgb(173, 227, 239) !important;
}

.chiclet-button__icon {
  font-size: 7em;
  color: rgb(85, 85, 85);
}
.p-button-icon.chiclet-button__icon:before {
  font-weight: unset;
}
</style>
