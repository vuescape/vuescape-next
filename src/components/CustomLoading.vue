<script lang="ts">
/**
 * CustomLoading @component
 *
 * This is a Vue Single File Component (SFC) that displays a loading overlay and spinner image
 *
 * @prop {CustomLoadingProps} - defaults to isVisible: false
 *
 */
export default {}
</script>

<script lang="ts" setup>
import type { CustomLoadingProps } from '../models/componentProps/CustomLoadingProps'
// TODO: Why is this image not loading?
import loadingImage from '../assets/thin-broken-ring-335.gif'

const props = withDefaults(defineProps<CustomLoadingProps>(), {
  isVisible: false,
  shouldCoverDialogs: false
})
</script>

<template>
  <div
    v-if="props.isVisible"
    :class="[
      'custom-loading-wrapper',
      { 'custom-loading-wrapper--cover-dialogs': props.shouldCoverDialogs }
    ]"
  >
    <img alt="Loading" class="custom-loading" :src="loadingImage" />
  </div>
</template>

<style scoped>
.custom-loading-wrapper {
  position: fixed; /* Use fixed positioning to overlay entire screen */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  /*
   * Covers the page's content (nothing in it goes above 3) but stays beneath the app's chrome: the pinned navigator
   * (40), footer (50), header (100) and the unpinned navigator (1000). So while a page loads, the user can still pin
   * the navigator, pick another report, or leave the page.
   * Inside a dialog (as v-loading adds) the dialog is its stacking context, so this still covers the dialog.
   */
  z-index: 30;
}

/* Above PrimeVue's dialogs (from 1100), for a dialog's spinner sent to the body */
.custom-loading-wrapper--cover-dialogs {
  z-index: 9999;
}

.custom-loading {
  /* Image is 64px */
  width: 64px;
  height: 64px;
}
</style>
