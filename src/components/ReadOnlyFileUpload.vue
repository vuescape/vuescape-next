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
  actionStore.dispatch(
    downloadNavigationAction,
    ReportPaneKind.None
  )
}
</script>

<template>
  <div class="file-upload__container mb-4">
    <!-- <div class="file-upload__header--title">
      {{ title }}
    </div> -->

    <div
      v-if="props?.id"
      class="border-primary-300 rounded-border flex flex-col items-center justify-center border-2 border-dashed p-6"
      style="min-height: 160px"
    >
      <div class="flex items-center gap-4">
        <span v-if="fileName" class="text-color truncate text-lg font-bold">
          {{ fileName }}
        </span>
        <span v-if="fileName" class="text-muted-color mt-1 -ml-2 text-sm">
          ({{ formatSize(fileSizeInBytes, fileSizeTypes) }})
        </span>
      </div>
      <VuescapeButton
        class="mt-2"
        v-if="downloadNavigationAction"
        icon="fad fa-cloud-download-alt"
        :outlined="true"
        label="Download"
        @click="onDownloadClick"
      >
      </VuescapeButton>
    </div>

    <div v-else class="text-muted-color text-center text-sm">No files available for download.</div>
  </div>
</template>

<style scoped>
.file-upload__header--title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
</style>
