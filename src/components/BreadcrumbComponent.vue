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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { BreadcrumbItem } from '../models/BreadcrumbItem'

const router = useRouter()

// Props for custom breadcrumbs
const props = defineProps<{
  customBreadcrumbs?: BreadcrumbItem[] | null
}>()

// Use only custom breadcrumbs - no URL-based logic
const computedBreadcrumbs = computed(() => {
  // If customBreadcrumbs is explicitly null, don't show any breadcrumbs
  if (props.customBreadcrumbs === null) {
    return []
  }
  return props.customBreadcrumbs || []
})

const handleBreadcrumbClick = async (event: Event, path: string) => {
  // Prevent default link behavior
  event.preventDefault()
  // Use Vue Router for navigation
  await router.push(path)
}
</script>

<template>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <transition name="fade" mode="out-in">
      <ol
        v-if="computedBreadcrumbs && computedBreadcrumbs.length > 1"
        class="breadcrumb__list"
        key="breadcrumbs"
      >
        <li
          v-for="(crumb, index) in computedBreadcrumbs"
          :key="`breadcrumb-${index}`"
          class="breadcrumb__item"
        >
          <component
            :is="crumb.clickable ? 'a' : 'span'"
            :href="crumb.clickable ? crumb.path : undefined"
            :class="{
              breadcrumb__link: crumb.clickable,
              breadcrumb__text: !crumb.clickable
            }"
            @click="crumb.clickable ? handleBreadcrumbClick($event, crumb.path) : undefined"
            :aria-current="index === computedBreadcrumbs.length - 1 ? 'page' : undefined"
          >
            {{ crumb.label }}
          </component>

          <span
            v-if="index < computedBreadcrumbs.length - 1"
            class="breadcrumb__separator"
            aria-hidden="true"
          >
            /
          </span>
        </li>
      </ol>
    </transition>
  </nav>
</template>

<style scoped>
.breadcrumb {
  padding: 1px 0;
  font-size: 14px;
  color: #666;
  min-height: 20px; /* Reserve space even when empty */
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
  text-decoration: none;
  font-weight: 500;
}

.breadcrumb__link:hover {
  text-decoration: underline;
}

/* 
.breadcrumb__link:focus {
  outline: 2px solid #2196f3;
  outline-offset: 2px;
}
*/

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
