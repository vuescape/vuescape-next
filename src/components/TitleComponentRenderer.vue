<script lang="ts">
/**
 * TitleComponentRenderer @component
 *
 * This is a Vue Single File Component (SFC) that renders a title.
 *
 * @prop {TitleComponentPayload} - the TitleComponent props
 *
 */
export default {}
</script>

<script lang="ts" setup>
import type { TitleComponentPayload } from '../models'

const props = defineProps<TitleComponentPayload>()
</script>

<template>
  <div class="title">{{ props.text }}</div>
</template>

<style scoped>
.title {
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 700;
}
</style>
