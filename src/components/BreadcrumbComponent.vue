<script lang="ts">
/**
 * BreadcrumbComponent @component
 *
 * A Vue Single File Component (SFC) that renders a breadcrumb navigation
 * based on route metadata. Automatically generates breadcrumbs from the
 * current route hierarchy.
 */
export default {}
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { computeBreadcrumbs, type BreadcrumbItem } from '../composables/useBreadcrumb'

const route = useRoute()
const router = useRouter()

// Simple reactive state for breadcrumbs
const breadcrumbs = ref<BreadcrumbItem[]>([])
const isTransitioning = ref(false)

// Function to update breadcrumbs - called by parent component
const updateBreadcrumbs = () => {
  isTransitioning.value = true
  setTimeout(() => {
    breadcrumbs.value = computeBreadcrumbs(route, router)
    isTransitioning.value = false
  }, 100)
}

const navigateToBreadcrumb = async (path: string) => {
  await router.push(path)
}

// Initialize breadcrumbs when component mounts
onMounted(() => {
  updateBreadcrumbs()
})

// Expose updateBreadcrumbs for parent components
defineExpose({
  updateBreadcrumbs
})
</script>

<template>
  <nav
    v-if="breadcrumbs.length > 1"
    class="breadcrumb"
    :class="{ 'breadcrumb--transitioning': isTransitioning }"
    aria-label="Breadcrumb"
  >
    <ol class="breadcrumb__list">
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="`breadcrumb-${index}`"
        class="breadcrumb__item"
      >
        <component
          :is="crumb.clickable ? 'button' : 'span'"
          :class="{
            breadcrumb__link: crumb.clickable,
            breadcrumb__text: !crumb.clickable
          }"
          @click="crumb.clickable ? navigateToBreadcrumb(crumb.path) : undefined"
          :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
        >
          {{ crumb.label }}
        </component>

        <span
          v-if="index < breadcrumbs.length - 1"
          class="breadcrumb__separator"
          aria-hidden="true"
        >
          /
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb {
  padding: 1px 0;
  font-size: 14px;
  color: #666;
  transition: opacity 0.2s ease-in-out;
}

.breadcrumb--transitioning {
  opacity: 0.7;
}

.breadcrumb__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
}

.breadcrumb__item {
  display: flex;
  align-items: center;
}

.breadcrumb__link {
  background: none;
  border: none;
  color: var(--p-cometrics-primary-color);
  cursor: pointer;
  padding: 2px 4px;
  text-decoration: underline;
  font-weight: 500;
}

.breadcrumb__text {
  color: #333;
  font-weight: 500;
  padding: 2px 4px;
}

.breadcrumb__separator {
  margin: 0 4px;
  color: #999;
  user-select: none;
}
</style>
