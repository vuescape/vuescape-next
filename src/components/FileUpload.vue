<script lang="ts">
/**
 * FileUpload @component
 *
 * This is a Vue Single File Component (SFC) that renders File Upload component.
 *
 * @prop {FileUploadProps} fileUploadProps
 *
 */

export default {}
</script>

<script setup lang="ts">
import { usePrimeVue } from 'primevue/config'
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, ref } from 'vue'
import type { FileUploadProps } from '../models/componentProps/FileUploadProps'

// Name PFileUpload to avoid naming conflict with this component
import PFileUpload from 'primevue/fileupload'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import { formatSize } from '../infrastructure/formatters'

const $primevue = usePrimeVue()
const toast = useToast()

const chooseFileFn = ref<(() => void) | undefined>(undefined)
const removeFileFn = ref<((index: number) => void) | undefined>(undefined)

const files = ref<Array<File>>([])

// props
const props = withDefaults(defineProps<FileUploadProps>(), {
  maxFileSizeInBytes: 5 * 1024 * 1024, // 5MB default
  acceptFileTypeExtensions: () => [],
  uploadInstructionText: 'drag and drop or click to choose your file'
})

const isValid = computed(() => {
  if (props.isRequired && files.value.length === 0) {
    return false
  }

  return files.value.every((file) => file.size <= props.maxFileSizeInBytes)
})

const acceptFileTypes = computed(() => {
  const extensions = props.acceptFileTypeExtensions ?? []
  const result =
    extensions.length === 0 || (extensions.length === 1 && extensions[0].trim() === '')
      ? ''
      : extensions.join(',')
  return result
})

// events
const emit = defineEmits<{
  (e: 'files-changed', payload: { isValid: boolean; files: Array<File> }): void
}>()

function clearFiles() {
  for (let i = 0; i < files.value.length; i++) {
    if (removeFileFn.value) {
      removeFileFn.value(i)
    }
  }
  files.value = []
}

/**
 * Exposes the `clearFiles` method to the parent component.
 *
 * The `clearFiles` method is used to clear the uploaded files in the component.
 */
defineExpose({ clearFiles })

const onRemoveTemplatingFile = (
  file: File,
  removeFileCallback: (index: number) => void,
  index: number
) => {
  removeFileCallback(index)
  // Remove from local files array
  files.value.splice(index, 1)

  emit('files-changed', { isValid: isValid.value, files: [...files.value] })
}

const onSelectedFiles = (event: { files: File[] }) => {
  const validFiles: File[] = []
  const rejectedIndices: number[] = []
  event.files.forEach((file, index) => {
    if (file.size <= props.maxFileSizeInBytes) {
      validFiles.push(file)
    } else {
      rejectedIndices.push(index)
    }
  })

  files.value = validFiles
  emit('files-changed', { isValid: isValid.value, files: [...files.value] })

  // 🔥 Remove from PrimeVue internal list
  if (rejectedIndices.length > 0 && typeof removeFileFn.value === 'function') {
    // Reverse order to avoid index shifting
    rejectedIndices.reverse().forEach((index) => {
      if (removeFileFn.value) {
        removeFileFn.value(index)
      }
    })

    toast.add({
      severity: 'warn',
      summary: 'File too large',
      detail: `The selected file exceeded the max size of ${formatSize(
        props.maxFileSizeInBytes
      )}. Select a smaller file and try again.`,
      life: 10000
    })
  }
}

const sizes = $primevue?.config?.locale?.fileSizeTypes

onMounted(() => {
  emit('files-changed', { isValid: isValid.value, files: [...files.value] })
})
</script>

<template>
  <Toast />
  <div class="file-upload__container">
    <PFileUpload
      customUpload
      :showHeader="false"
      :multiple="false"
      :accept="acceptFileTypes"
      @select="onSelectedFiles"
      :pt="{ header: { style: 'display:none' } }"
    >
      <template #header="{ chooseCallback }">
        <div></div>
        <template v-if="!chooseFileFn">{{ chooseFileFn = chooseCallback }}</template>
      </template>

      <!-- 🔳 Shared border container for both content and empty -->
      <template #content="{ files, removeFileCallback }">
        <template v-if="!removeFileFn">
          {{ removeFileFn = removeFileCallback }}
        </template>

        <div
          v-if="files.length > 0"
          class="border-primary rounded-border flex flex-col items-center justify-center border-2 border-dashed p-6"
          style="min-height: 160px"
        >
          <div
            v-for="(file, index) of files"
            :key="file.name + file.type + file.size"
            class="flex items-center gap-4"
          >
            <span class="text-color truncate text-lg font-bold">
              {{ file.name }}
            </span>
            <span class="text-muted-color mt-1 -ml-2 text-sm">
              ({{ formatSize(file.size, sizes) }})
            </span>
            <Button
              icon="fas fa-trash-can"
              @click="onRemoveTemplatingFile(file, removeFileCallback, index)"
              outlined
              rounded
              severity="secondary"
              class="file-upload__button--delete mt-1"
            />
          </div>
        </div>
      </template>

      <template #empty>
        <div
          class="border-primary-300 rounded-border flex flex-col items-center justify-center border-2 border-dashed p-6"
          style="min-height: 160px"
          @click="chooseFileFn?.()"
        >
          <div class="file-upload__p--instruction-text pb-4 text-xl font-medium">
            {{ uploadInstructionText }}
          </div>
          <i class="fad fa-cloud-upload file-upload__upload--icon" />
        </div>
      </template>
    </PFileUpload>
  </div>
</template>

<style>
/* TODO use theming if possible  */
.file-upload__select--hover {
  cursor: pointer;
}
.file-upload__select--border {
  border-color: #9bdddb !important;
}
.file-upload__p--instruction-text {
  font-size: 20px;
}
.file-upload__container .p-fileupload-advanced {
  border: unset;
}
.file-upload__upload--icon {
  font-size: 64px;
}
.file-upload__header--title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.file-upload__button--delete {
  width: 1.5rem !important;
  height: 1.5rem !important;
  border: 0 !important;
}
</style>
