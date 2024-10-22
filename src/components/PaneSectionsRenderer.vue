<script lang="ts">
/**
 * PaneSectionsRenderer @component
 *
 * This is a Vue Single File Component (SFC) that renders a list of pane sections.
 *
 * @prop {Array<PaneSection>} sections - the list of PaneSection to render
 *
 */
export default {}
</script>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { PaneSection } from '../models/dynamic-ui/PaneSection'

const props = defineProps<{ sections: Array<PaneSection> }>()
</script>

<template>
  <div>
    <div v-for="section in props.sections" :key="section.id">
      <PaneSectionRenderer :section></PaneSectionRenderer>
    </div>
  </div>
</template>
