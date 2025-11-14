<script lang="ts">
/**
 * TextComponentRenderer @component
 *
 * This is a Vue Single File Component (SFC) that renders text.
 *
 * @prop {TextComponentPayload} - the TextComponent props
 *
 */
export default {}
</script>

<script lang="ts" setup>
import type { TextComponentPayload } from '../models/dynamic-ui/pane-components/TextComponentPayload'

defineProps<TextComponentPayload>()
</script>

<template>
  <div v-if="renderTextAs === 'heading'" class="header">{{ text }}</div>
  <div v-else-if="renderTextAs === 'subheading'" class="subheader">{{ text }}</div>
  <div v-else-if="renderTextAs === 'paragraph'" class="paragraph">{{ text }}</div>
  <div v-else-if="renderTextAs === 'html'" class="html" v-html="text"></div>
</template>

<style scoped>
.header {
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 700;
  align-self: center;
}
.subheader {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.paragraph {
  font-size: 16px;
  /* font-weight: 400; */
  margin-bottom: 0.5rem;
}
.html {
  font-size: 18px;
  margin-bottom: 0.5rem;
}
.html :deep(a) {
  text-decoration: underline;
  color: var(--p-primary-color);
}
</style>
