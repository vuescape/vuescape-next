<script setup lang="ts">
import VuescapeButton from '../VuescapeButton.vue'

import type { WizardMessageProps } from '../../models/componentProps/WizardMessageProps'

const props = defineProps<WizardMessageProps>()
</script>

<template>
  <div
    class="flex flex-column align-items-center justify-content-center text-center px-4"
    style="min-height: 100%; min-width: 300px"
  >
    <div v-if="props.title" class="mt-4 text-xl font-semibold">{{ props.title }}</div>
    <div class="mt-3 mb-3" v-html="props.messageHtml"></div>
    <VuescapeButton
      v-if="props.buttonText"
      :label="props.buttonText"
      @click="props.onclick"
    />
  </div>
</template>

