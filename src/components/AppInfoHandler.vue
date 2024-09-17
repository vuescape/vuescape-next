<script lang="ts" setup>
import VuescapeDialog from './VuescapeDialog.vue'
import { useAppInfoStore } from '../stores/useAppInfoStore'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const isVisible = ref(false)
const appInfoStore = useAppInfoStore()

const reload = () => {
  isVisible.value = false
  document.location.reload()
}
const startPolling = () => {
  console.info('startPolling')
  appInfoStore.startPolling()
}

const stopPolling = () => {
  console.info('stopPolling')
  appInfoStore.stopPolling()
}

// Start polling when the component is mounted
onMounted(async () => {
  console.info('onMounted')
  await appInfoStore.fetchAppInfoAsync()
  startPolling()
})

// Stop polling when the component is unmounted
onUnmounted(() => {
  stopPolling()
})

watch(
  () => appInfoStore.state.version,
    // @ts-ignore-once: TS6133
  (newValue: string, oldValue: string) => {
    // If oldValue exists then it means the version has been updated
    // after version was populated during app start.
    if (oldValue) {
      isVisible.value = true
    }
  },
)
</script>

<template>
  <VuescapeDialog
    v-model:modelValue="isVisible"
    :closable="false"
    headerText="Updates Available"
    okButtonText="Refresh Now"
    @update:visible="reload">
    <div>
      <p>
        We've been hard at work adding features and fixing issues!
      </p>
      <br />
      <p>
        To load these updates we do require a refresh of the browser.
      </p>
      <br />
      <p>
        Click the Refresh Now button below to load the new features in version
        {{ appInfoStore.state.version }}.
      </p>
    </div>
  </VuescapeDialog>
</template>
