<script lang="ts">
/**
 * VuescapeCard @component
 *
 * This is a Vue Single File Component (SFC) that renders a bordered card with an optional header and
 * footer band, following the theme's content and surface colors.
 *
 * @slot header - the header band content; omitted when the slot is not provided
 * @slot default - the card body
 * @slot footer - the footer band content; omitted when the slot is not provided
 */
export default {}
</script>

<script lang="ts" setup>
import { useSlots } from 'vue'

const slots = useSlots()
</script>

<template>
  <div
    class="flex w-full flex-col overflow-hidden rounded-lg shadow-lg"
    style="background: var(--p-content-background); border: 1px solid var(--p-content-border-color)"
  >
    <div
      v-if="slots.header"
      class="border-b px-6 py-4"
      style="background: var(--p-surface-50); border-color: var(--p-content-border-color)"
    >
      <slot name="header" />
    </div>
    <div class="flex-grow px-6 py-5">
      <slot />
    </div>
    <div
      v-if="slots.footer"
      class="border-t px-6 py-4"
      style="background: var(--p-surface-50); border-color: var(--p-content-border-color)"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
