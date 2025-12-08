<script lang="ts">
/**
 * ActionButton @component
 *
 * This is a Vue Single File Component (SFC) that renders an action button.
 * This is a button that has a dropdown menu of actions.
 *
 * @prop {ActionButtonProps} actionButtonProps - The action button props.
 *
 */
export default {}
</script>

<script setup lang="ts">
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import type { MenuItem } from 'primevue/menuitem'
import { computed, ref } from 'vue'
import type { ActionButtonProps } from '../models/componentProps/ActionButtonProps'
import type { ActionMenuItem } from '../models/dynamic-ui/ActionMenuItem'
import { useActionStore } from '../stores/useActionStore'
import { ReportPaneKind } from '../models/feature/ReportPaneKind'

const props = defineProps<ActionButtonProps>()
const menuRef = ref()
const buttonRef = ref()
const actionStore = useActionStore()

function handleActionEvent(actionMenuItem: ActionMenuItem) {
  // All payload information must reside inside the action itself.
  // Additional data can be handled by creating new action types if needed.
  actionStore.dispatch(actionMenuItem.action, ReportPaneKind.None)
}

const menuActions = computed(() =>
  props.menuItems.map((actionMenuItem) => {
    const result: MenuItem = { ...actionMenuItem, command: () => handleActionEvent(actionMenuItem) }
    result.icon = actionMenuItem?.icons?.join(' ')
    result.iconPos = actionMenuItem.iconPosition ?? 'right'
    result.disabled = actionMenuItem.isDisabled ?? false
    result.title = actionMenuItem.tooltip
    return result
  })
)

const icons = computed(() => {
  return props.icons?.join(' ')
})

const iconPos = computed(() => {
  return props.iconPosition ?? 'left'
})

const menuStyle = computed(() => {
  const width = buttonRef.value?.$el?.offsetWidth
  return width ? { minWidth: `${width}px` } : {}
})

const toggleMenu = (e: Event) => menuRef.value.toggle(e)
</script>

<template>
  <Button
    ref="buttonRef"
    class="action-button"
    :label="label"
    :icon="icons"
    :iconPos="iconPos"
    :disabled="isDisabled"
    :title="tooltip"
    @click="toggleMenu"
  />
  <Menu ref="menuRef" :model="menuActions" :style="menuStyle" popup />
</template>

<style scoped>
/* TODO: Add this to the theme */
.action-button {
  font-size: 14px;
  line-height: 0;
  height: 26px;
}
</style>
