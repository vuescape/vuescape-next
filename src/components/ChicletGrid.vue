<script lang="ts">
/**
 * ChicletGrid @component
 *
 * This is a Vue Single File Component (SFC) that renders Chiclets in a grid.
 *
 * @prop {ChicletGridProps} chicletGridProps
 *
 */

export default {}
</script>
<script setup lang="ts">
import type { ChicletGridProps } from '../models'
import ChicletButton from './ChicletButton.vue'

const props = defineProps<{ chicletGridProps: ChicletGridProps }>()
</script>

<template>
  <div class="chiclet-grid__container">
    <div
      v-for="chiclet in props.chicletGridProps.chiclets"
      :key="chiclet.id"
      class="chiclet-grid__button-wrapper m-2"
    >
      <ChicletButton :chiclet="chiclet" />
      <div class="chiclet-grid__button-label">{{ chiclet.title }}</div>
    </div>
  </div>
</template>

<style>
.chiclet-grid__container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.chiclet-grid__button-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.chiclet-grid__button-label {
  text-align: center;
  margin-top: 8px;
  word-wrap: break-word;
  max-width: 160px;
  white-space: normal;
}
</style>
