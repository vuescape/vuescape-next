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
import { useRouter } from 'vue-router'

import Button from 'primevue/button'

import type { Action, Chiclet, NavigateActionPayload } from '../models/dynamic-ui/'

/**
 * Props definition for the ChicletButton component.
 *
 * @property {Chiclet} chiclet - The chiclet object containing data for the button.
 */
const props = defineProps<{ chiclet: Chiclet }>()

/**
 * Computed property that returns the icons used in the ChicletButton component.
 */
const icons = computed(() => {
  const result = props.chiclet.icons?.join(' ') ?? ''
  return result
})

/**
 * Handles the action when the ChicletButton is clicked.
 * This function is responsible for executing the primary action associated with the button.
 */
// TODO: handling an action will no doubt be used in more than one component,
// so it should be extracted to a utility function
const handleAction = () => {
  const { action } = props.chiclet
  switch (action.type) {
    case 'navigate': {
      const payload = action.payload as NavigateActionPayload
      if (payload.url?.startsWith('http')) {
        window.open(payload.url, payload.target ?? '_self')
      } else if (payload.url) {
        if (payload.replace === true) {
          router.replace(payload.url)
        } else {
          router.push(payload.url)
        }
      }
      break
    }
    case 'unknown':
      console.warn('Action type is unknown')
      break
    default:
      throw new Error('Action type is not supported: ' + (action as Action).type)
  }
}

const router = useRouter()
</script>

<template>
  <Button
    v-if="chiclet.isVisible"
    :icon="icons"
    iconPos="top"
    iconClass="chiclet-button__icon"
    :class="['chiclet-button__layout', chiclet.cssClass]"
    @click="handleAction"
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
