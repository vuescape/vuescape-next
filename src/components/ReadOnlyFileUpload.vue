<script lang="ts">
/**
 * ReadOnlyFileUpload @component
 *
 * This is a Vue Single File Component (SFC) that renders read only version of File Upload component.
 *
 * @prop {ReadOnlyFileUploadProps} readOnlyFileUploadProps
 *
 */

export default {}
</script>

<script setup lang="ts">
import { usePrimeVue } from 'primevue/config'
import { useActionStore } from '../stores/useActionStore'

import type { ReadOnlyFileUploadProps } from '../models/componentProps/ReadOnlyFileUploadProps'

import VuescapeButton from './VuescapeButton.vue'
import { ReportPaneKind } from '../models'

import { formatSize } from '../infrastructure/formatters'

// props
const props = defineProps<ReadOnlyFileUploadProps>()

const fileSizeTypes = usePrimeVue().config.locale?.fileSizeTypes

const actionStore = useActionStore()

const onDownloadClick = () => {
  const downloadNavigationAction = props.downloadNavigationAction
  if (!downloadNavigationAction) {
    return
  }
  actionStore.$patch({ action: downloadNavigationAction, paneKind: ReportPaneKind.None })
}
</script>

<template>
  <div class="file-upload__container">
    <div class="file-upload__header--title">
      {{ title }}
    </div>

    <div
      v-if="props?.id"
      class="flex flex-column align-items-center justify-content-center border-2 border-dashed border-primary-300 border-round p-4"
      style="min-height: 160px"
    >
      <span class="font-bold text-lg text-center text-color">
        {{ fileName }}
      </span>
      <span class="text-sm text-color-secondary mb-2">
        {{ formatSize(fileSizeInBytes, fileSizeTypes) }}
      </span>
      <VuescapeButton
        icon="fad fa-cloud-download-alt"
        :outlined="true"
        label="Download"
        @click="onDownloadClick"
      >
      </VuescapeButton>
    </div>

    <div v-else class="text-color-secondary text-center text-sm">
      No files available for download.
    </div>
  </div>
</template>

<style scoped>
.file-upload__container {
  margin-bottom: 1rem;
}
.file-upload__header--title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
</style>
