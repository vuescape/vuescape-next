<script lang="ts">
/**
 * TextLinkComponent @component
 *
 * This is a Vue Single File Component (SFC) that renders text as a link.
 *
 * @prop {TextLinkComponentProps} - the text link props
 *
 */
export default {}
</script>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import type { TextLinkComponentProps } from '../models/componentProps/TextLinkComponentProps'
import {
  getSourcePaneKind,
  handleActionAsync
} from '../models/dynamic-ui/actions/ActionHandlers'
import { useDownloadService } from '../composables/useDownloadService'

const router = useRouter()
const downloadService = useDownloadService()

const props = defineProps<TextLinkComponentProps>()
const handleClickAsync = async (event: Event) => {
  // This handler will not load a report but instead will simply navigate to a new route.
  // Sometimes event can be wrap the original event.
  const eventToUse = (event as unknown as any).originalEvent ?? event
  const sourcePaneKind = getSourcePaneKind(eventToUse)
  await handleActionAsync(
    { action: props.action, paneKind: sourcePaneKind },
    router,
    downloadService.downloadReportAsync
  )
}
</script>

<template>
  <a class="link" @click.prevent="handleClickAsync" :href="props.action.payload.url">{{
    props.text
  }}</a>
</template>

<style scoped>
.link {
  text-decoration: underline;
  /* TODO: use a color from the theme */
  color: #4183c4;
  cursor: pointer;
}
</style>
