<script lang="ts">
/**
 * ProgressToast @component
 *
 * A custom toast component with an infinite moving progress bar at the top.
 * Based on PrimeVue Toast but with custom styling and progress animation.
 */
export default {}
</script>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import ProgressBar from 'primevue/progressbar'

export interface ProgressToastProps {
  visible?: boolean
  severity?: 'success' | 'info' | 'warn' | 'error'
  summary?: string
  detail?: string
  life?: number
  closable?: boolean
  group?: string
  sticky?: boolean
}

const props = withDefaults(defineProps<ProgressToastProps>(), {
  visible: true,
  severity: 'info',
  summary: '',
  detail: '',
  life: 3000,
  closable: true,
  group: 'br',
  sticky: false
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isVisible = ref(props.visible)

const toastClasses = computed(() => {
  const baseClasses = 'progress-toast p-toast-message-progress'
  const severityClass = `p-toast-message-${props.severity}`
  return `${baseClasses} ${severityClass}`
})

const hideToast = () => {
  isVisible.value = false
  emit('close')
}

// Watch for visibility changes
watch(
  () => props.visible,
  (newValue) => {
    isVisible.value = newValue
  }
)

// Auto-hide after life duration if not sticky
onMounted(() => {
  if (props.visible && !props.sticky && props.life > 0) {
    setTimeout(() => {
      hideToast()
    }, props.life)
  }
})

// Expose methods for parent components
defineExpose({
  show: () => {
    isVisible.value = true
  },
  hide: hideToast
})
</script>

<template>
  <div v-if="isVisible" :class="toastClasses" @click="hideToast">
    <!-- PrimeVue Progress Bar -->
    <div class="progress-bar-container">
      <ProgressBar mode="indeterminate" style="height: 6px" />
    </div>

    <!-- Toast Content -->
    <div class="p-toast-message-content">
      <div class="p-toast-message-icon">
        <i
          :class="{
            'pi pi-check': props.severity === 'success',
            'pi pi-info-circle': props.severity === 'info',
            'pi pi-exclamation-triangle': props.severity === 'warn',
            'pi pi-times-circle': props.severity === 'error'
          }"
        ></i>
      </div>
      <div class="p-toast-message-text">
        <div class="p-toast-summary">{{ props.summary }}</div>
        <div v-if="props.detail" class="p-toast-detail">
          {{ props.detail }}
        </div>
      </div>
      <button v-if="props.closable" class="p-toast-icon-close" @click="hideToast">
        <i style="font-size: 10px; vertical-align: super" class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.progress-toast {
  position: fixed !important;
  bottom: 20px !important;
  right: 20px !important;
  z-index: 1100 !important;
  min-width: 300px;
  max-width: 400px;
  overflow: hidden;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin: 0 !important;
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.p-toast-message-progress {
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 1rem;
}

.progress-bar-container {
  margin-top: 0.7rem;
  margin-right: 10px;
  margin-left: 10px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: #4c4c4c;
  overflow: hidden;
  border-radius: 6px;
}

/* Override PrimeVue ProgressBar styles for dark theme */
.progress-bar-container :deep(.p-progressbar) {
  background: transparent;
  border-radius: 6px;
}

.progress-bar-container :deep(.p-progressbar-indeterminate-container) {
  background: #4c4c4c;
  border-radius: 6px;
}

.progress-bar-container :deep(.p-progressbar-indeterminate-container .p-progressbar-value) {
  background: #888888 !important;
  border-radius: 6px;
}

.progress-bar-container :deep(.p-progressbar-indeterminate-container .p-progressbar-value::before) {
  background: #888888 !important;
}

/* Additional overrides for PrimeVue theme colors */
.progress-bar-container :deep(.p-progressbar .p-progressbar-value) {
  background: #888888 !important;
}

.progress-bar-container :deep(.p-progressbar-indeterminate-container .p-progressbar-value) {
  background: linear-gradient(90deg, transparent, #888888, transparent) !important;
}

.p-toast-message-content {
  margin-top: 0.7rem;
  position: relative;
  z-index: 1;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.p-toast-message-icon {
  flex-shrink: 0;
  font-size: 1.25rem;
}

.p-toast-message-text {
  flex: 1;
  min-width: 0;
}

.p-toast-summary {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.p-toast-detail {
  font-size: 0.875rem;
  opacity: 0.9;
  line-height: 1.4;
}

/* Top Right Close Button */
.p-toast-icon-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #e8e8e8;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 1rem;
  height: 24px;
}

.p-toast-icon-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.p-toast-icon-close:active {
  background: rgba(255, 255, 255, 0.2);
}

/* Dark theme colors */
.p-toast-message-success,
.p-toast-message-info,
.p-toast-message-warn,
.p-toast-message-error {
  background: #323232;
  color: #e8e8e8;
}

/* Responsive design */
@media (max-width: 640px) {
  .p-toast-message-content {
    padding: 0.75rem;
  }

  .p-toast-summary {
    font-size: 0.875rem;
  }

  .p-toast-detail {
    font-size: 0.8rem;
  }
}
</style>
