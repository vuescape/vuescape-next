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
  actionStore.dispatch(downloadNavigationAction, ReportPaneKind.None)
}
</script>

<template>
  <div class="file-upload__container mb-4">
    <div
      v-if="props?.id"
      class="border-primary rounded-border flex flex-col items-center justify-center border-2 border-solid p-6"
      style="min-height: 160px"
    >
      <div v-if="fileName" class="flex items-center gap-4">
        <span class="text-color truncate text-lg font-bold">
          {{ fileName }}
        </span>
        <span class="text-muted-color mt-1 -ml-2 text-sm">
          ({{ formatSize(fileSizeInBytes, fileSizeTypes) }})
        </span>
      </div>
      <div v-else class="flex items-center gap-4">
        <span class="text-color overflow-visible text-lg italic">
          No file was uploaded
        </span>
      </div>
      <div
        v-for="(line, i) in metadataLineItems"
        :key="i"
        class="mt-1 mb-1 flex items-center justify-center gap-2 text-sm"
      >
        <i v-if="line?.icons?.length" :class="`${line.icons.join(' ')} ${line.iconClass}`"></i>
        <span :class="line?.textClass">{{ line?.text }}</span>
      </div>
      <VuescapeButton
        class="mt-4"
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

<style>
.file-upload__header--title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
</style>
