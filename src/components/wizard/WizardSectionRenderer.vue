<script lang="ts">
/**
 * WizardSectionRenderer @component
 *
 * This is a Vue Single File Component (SFC) that renders a section of pane components passed in via props for a wizard.
 *
 * @prop {PaneSection} section - The pane section to render
 */
export default {}
</script>

<script setup lang="ts">
import { onActivated, ref } from 'vue'
import type { WizardSectionRendererProps } from '../../models/componentProps/WizardSectionRendererProps'

import PaneComponentRenderer from '../PaneComponentRenderer.vue'

interface HasValidation {
  isValid: boolean
}

function hasValidation(payload: any): payload is HasValidation {
  return typeof payload?.isValid === 'boolean'
}

const props = defineProps<WizardSectionRendererProps>()

const emit = defineEmits<{
  (e: 'update', allPayloads: Record<string, any>): void
  (e: 'can-continue', canContinue: boolean): void
}>()

// A reactive store for all component values by id
const componentState = ref<Record<string, any>>({})

const isValid = () => {
  // Get all expected component IDs from props.section
  const expectedIds = props.section.items.flatMap((item) =>
    item.components.map((component: { payload: any }) => component.payload.id)
  )

  // Check if all expected components have valid payloads
  const allValid = expectedIds.every((id) => {
    const entry = componentState.value[id]
    // All expected components must be valid.
    // If there is no validation then that component is valid.
    return hasValidation(entry) ? entry.isValid === true : true
  })

  return allValid
}

function onUpdate(id: string, payload: any) {
  componentState.value[id] = payload
  emit('update', { ...componentState.value })
  const allValid = isValid()

  emit('can-continue', allValid)
}

onActivated(() => {
  // TODO: Do we need to emit an update?
  emit('can-continue', isValid())
})
</script>

<template>
  <div>
    <template v-for="(item, itemIndex) in props.section.items" :key="`section-item-${itemIndex}`">
      <PaneComponentRenderer
        v-for="(component, compIndex) in item.components"
        :key="`${component.typeName}-${compIndex}`"
        :component="component"
        @update="(id, payload) => onUpdate(id, payload)"
      />
    </template>
  </div>
</template>
