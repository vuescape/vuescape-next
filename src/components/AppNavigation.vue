<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'

interface Props {
  /**
   * Whether the navigation is pinned (pushes content) or overlay (drawer mode).
   * Use v-model:pinned to control this from the outside.
   */
  pinned?: boolean

  /**
   * Whether the drawer should start open when not pinned.
   */
  startOpen?: boolean

  /**
   * Width of the navigation panel when pinned (in pixels).
   */
  navWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  pinned: false,
  startOpen: false,
  navWidth: 380
})

const emit = defineEmits<{
  /**
   * Emitted when the pinned state changes (for v-model:pinned).
   */
  (e: 'update:pinned', value: boolean): void

  /**
   * Emitted when the drawer open state changes.
   */
  (e: 'drawerToggle', open: boolean): void

  /**
   * Emitted when the drawer open state changes (for syncing to store).
   */
  (e: 'update:startOpen', value: boolean): void

  /**
   * Emitted when the drawer width changes.
   */
  (e: 'update:navWidth', value: number): void
}>()

// Two-way computed wrapper for pinned state.
const isPinned = computed({
  get: () => props.pinned,
  set: (value: boolean) => {
    emit('update:pinned', value)
  }
})

// Internal drawer open/close state for overlay mode.
const drawerOpen = ref(props.startOpen)

// Drawer should be visible when pinned OR when open in overlay mode
const isVisible = computed(() => isPinned.value || drawerOpen.value)

// Watch for visibility changes and emit event
watch([isPinned, drawerOpen], () => {
  emit('drawerToggle', isVisible.value)
})

// Watch for drawerOpen changes and emit to sync with store
watch(drawerOpen, (newValue) => {
  emit('update:startOpen', newValue)
})

// Watch for startOpen prop changes (from store) and sync to local state
watch(
  () => props.startOpen,
  (newValue) => {
    drawerOpen.value = newValue
  }
)

// Close drawer when clicking outside (only in overlay mode, not when pinned)
const navElement = ref<HTMLElement | null>(null)
onClickOutside(
  navElement,
  () => {
    if (!isPinned.value && drawerOpen.value) {
      drawerOpen.value = false
    }
  },
  { ignore: ['.app-navigation__ignore-click-outside'] }
)

// Resize functionality
const isResizing = ref(false)
const startX = ref(0)
const startWidth = ref(0)
const minWidth = 200
const minContentWidth = 400 // Minimum width for content area

function handleResizeStart(e: MouseEvent) {
  isResizing.value = true
  startX.value = e.clientX
  startWidth.value = props.navWidth
  e.preventDefault()
}

function handleResizeMove(e: MouseEvent) {
  if (!isResizing.value) return

  const delta = e.clientX - startX.value
  const proposedWidth = startWidth.value + delta

  // Calculate max width based on viewport to ensure content area has minimum width
  const viewportWidth = window.innerWidth
  const maxWidth = viewportWidth - minContentWidth

  const newWidth = Math.max(minWidth, Math.min(maxWidth, proposedWidth))

  emit('update:navWidth', newWidth)
}

function handleResizeEnd() {
  isResizing.value = false
}

// Setup global listeners for resize
if (typeof window !== 'undefined') {
  watch(isResizing, (resizing) => {
    if (resizing) {
      window.addEventListener('mousemove', handleResizeMove)
      window.addEventListener('mouseup', handleResizeEnd)
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    } else {
      window.removeEventListener('mousemove', handleResizeMove)
      window.removeEventListener('mouseup', handleResizeEnd)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  })
}
</script>

<template>
  <!-- Custom drawer that behaves like Vuetify's navigation drawer -->
  <Transition name="slide-drawer">
    <aside
      ref="navElement"
      v-show="isVisible"
      :class="[
        'app-navigation-custom',
        'fixed left-0 border-r border-gray-300 bg-white',
        isPinned ? 'app-navigation-pinned' : 'app-navigation-drawer',
        { resizing: isResizing }
      ]"
      :style="{
        width: `${props.navWidth}px`,
        top: '36px',
        bottom: '36px',
        zIndex: isPinned ? 40 : 1000
      }"
    >
      <slot />

      <!-- Resize handle -->
      <div class="resize-handle" @mousedown="handleResizeStart">
        <!-- Comment out the below line to enable a visual grip indicator -->
        <!-- <div class="resize-grip" /> -->
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
/* Drawer mode: overlay with shadow */
.app-navigation-drawer {
  box-shadow: 3px 5px 8px 3px rgba(0, 0, 0, 0.15);
}

/* Pinned mode: no shadow, integrated into layout */
.app-navigation-pinned {
  box-shadow: none;
}

/* Disable transitions when resizing */
.app-navigation-custom.resizing {
  transition: none !important;
}

/* Resize handle */
.resize-handle {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  cursor: ew-resize;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resize-handle:hover {
  background-color: rgba(46, 163, 242, 0.2);
  /*   background-color: rgba(59, 130, 246, 0.2); */
}

.resize-handle:active {
  background-color: rgba(46, 163, 242, 0.4);
  /*   background-color: rgba(59, 130, 246, 0.4); */
}

/* Visual grip indicator */
.resize-grip {
  width: 3px;
  height: 40px;
  background-color: rgba(107, 114, 128, 0.3);
  border-radius: 2px;
  transition: all 0.2s ease;
}

.resize-handle:hover .resize-grip {
  background-color: rgba(59, 130, 246, 0.6);
  height: 60px;
}

.resize-handle:active .resize-grip {
  background-color: rgba(59, 130, 246, 0.8);
}

/* Slide-in animation for drawer */
.slide-drawer-enter-active,
.slide-drawer-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-drawer-enter-from,
.slide-drawer-leave-to {
  transform: translateX(-100%);
}

.slide-drawer-enter-to,
.slide-drawer-leave-from {
  transform: translateX(0);
}
</style>
