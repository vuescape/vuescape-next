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
  handleNavigationActionAsync
} from '../models/dynamic-ui/actions/ActionHandlers'

const router = useRouter()

const props = defineProps<TextLinkComponentProps>()
const handleClickAsync = async (event: Event) => {
  // This handler will not load a report but instead will simply navigate to a new route.
  const loadReportAsync = async (url: string) => {}
  // Sometimes event can be wrap the original event.
  const eventToUse = (event as unknown as any).originalEvent ?? event
  const sourcePaneKind = getSourcePaneKind(eventToUse)
  await handleNavigationActionAsync(props.navigationAction, sourcePaneKind, router, loadReportAsync)
}
</script>

<template>
  <a class="link" @click.prevent="handleClickAsync" :href="props.navigationAction.payload.url">{{
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
