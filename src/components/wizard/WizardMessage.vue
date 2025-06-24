<script setup lang="ts">
import VuescapeButton from '../VuescapeButton.vue'

import type { WizardMessageProps } from '../../models/componentProps/WizardMessageProps'

const props = defineProps<WizardMessageProps>()
</script>

<template>
  <div
    class="flex flex-col items-center justify-center text-center px-6"
    style="min-height: 100%; min-width: 300px"
  >
    <div v-if="props.title" class="mt-6 text-xl font-semibold">{{ props.title }}</div>
    <div class="mt-4 mb-4" v-html="props.messageHtml"></div>
    <VuescapeButton
      v-if="props.buttonText"
      :label="props.buttonText"
      @click="props.onclick"
    />
  </div>
</template>

