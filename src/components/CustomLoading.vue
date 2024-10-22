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

const props = withDefaults(defineProps<CustomLoadingProps>(), {
  isVisible: false
})
</script>

<template>
  <div v-if="props.isVisible" class="custom-loading-wrapper">
    <img alt="Loading" class="custom-loading" src="@/assets/thin-broken-ring-335.gif" />
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
  z-index: 9999; /* Ensure it overlays other content */
}

.custom-loading {
  /* Image is 64px */
  width: 64px;
  height: 64px;
}
</style>
