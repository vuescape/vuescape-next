<script lang="ts">
/**
 * TextComponentRenderer @component
 *
 * This is a Vue Single File Component (SFC) that renders text.
 *
 * @prop {TextComponentRenderer} - the TitleComponent props
 *
 */
export default {}
</script>

<script lang="ts" setup>
import type { TextComponentPayload } from '../models/dynamic-ui/pane-components/TextComponentPayload'

const props = defineProps<TextComponentPayload>()
</script>

<template>
  <div v-if="props.renderTextAs === 'header'" class="header">{{ props.text }}</div>
  <div v-else-if="props.renderTextAs === 'subheader'" class="subheader">{{ props.text }}</div>
  <div v-else-if="props.renderTextAs === 'paragraph'" class="paragraph">{{ props.text }}</div>
  <div v-else-if="props.renderTextAs === 'html'" class="html" v-html="props.text"></div>
</template>

<style scoped>
.header {
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 700;
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
  margin-bottom: 0.5rem;
}
</style>
