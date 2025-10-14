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
import type { TextLinkComponentProps } from '../models/componentProps/TextLinkComponentProps'
import {
  handleActionEvent
} from '../models/dynamic-ui/actions/ActionHandlers'
import { useActionStore } from '../stores/useActionStore'

const actionStore = useActionStore()

const props = defineProps<TextLinkComponentProps>()
const handleClickAsync = (event: Event) => {
  // This handler dispatches the action to the action store instead of handling it directly.
  // The ActionStoreWatcher component will process the action using domain-specific handlers.
  const eventToUse = (event as unknown as any).originalEvent ?? event
  handleActionEvent(eventToUse, props.action, actionStore)
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
