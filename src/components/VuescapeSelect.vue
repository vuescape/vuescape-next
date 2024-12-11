<script lang="ts">
/**
 * VuescapeSelect @component
 *
 * This is a Vue Single File Component (SFC) that renders a Select
 *
 * @prop {VuescapeSelectProps} - the VuescapeSelectProps
 */
export default {}
</script>

<script lang="ts" setup>
import Select from 'primevue/Select'
import { ref, useAttrs } from 'vue'
import type { VuescapeSelectProps } from '../models/componentProps/VuescapeSelectProps'

debugger
const props = defineProps<VuescapeSelectProps>()
const initializedProps = ref<VuescapeSelectProps>({
  options: props.options ?? [],
  value: props.value ?? {},
  name: props.name ?? '',
  optionLabel: props.optionLabel ?? 'name',
  placeholder: props.placeholder ?? 'Select an Item',
  disabled: props.disabled ?? false,
  class: props.class ?? ''
})
const attrs = useAttrs()
</script>

<template>
  <!-- do we need card flex here or should it just be the bare component? -->
  <div class="card flex">
    <Select
      :name="initializedProps.name"
      :model-value="initializedProps.value"
      :options="initializedProps.options"
      :placeholder="initializedProps.placeholder"
      :option-label="initializedProps.optionLabel"
      :class="initializedProps.class"
      :disabled="initializedProps.disabled"
      v-bind="attrs"
    >
    </Select>
  </div>
</template>

<style scoped></style>
