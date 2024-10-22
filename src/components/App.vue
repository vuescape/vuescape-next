<script lang="ts">
/**
 * App @component
 *
 * This is a Vue Single File Component (SFC) that is the root of a Vue application.
 * It provides a layout for the application, including a header, footer, and main content area.
 * It also can display messages from the appInfo store and the notification store.
 *
 * @props {AppComponentProps}
 */
export default {}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import { useNotificationStore } from '../stores/useNotificationStore'
import type { AppComponentProps } from '../models/componentProps/AppComponentProps'
import NotificationMessages from './NotificationMessages.vue'

import { useAppInfoStore, type AppInfoStore, type NotificationStore } from '../stores'
import { Guid, type AppInfo } from '../models'
import type { NotificationMessage } from '../models/NotificationMessage'

const notificationStore = useNotificationStore() as NotificationStore
const messages = notificationStore.messages as Array<NotificationMessage>
const props = defineProps<AppComponentProps>()

const router = useRouter()
const route = useRoute()
router.afterEach((to, from) => {
  document.title = typeof to.meta.title === 'string' ? to.meta.title : 'CoMetrics'
  props.trackingService?.handleRouteChanged(to, from ?? to)
})

if (props.trackingService) {
  props.trackingService.initializeProvider()
}

// Function to remove a message from the list
const removeMessage = (id: string) => {
  const index = messages.findIndex((msg) => msg.id === id)
  if (index === -1) {
    return
  }
  messages.splice(index, 1)
  console.info('removed index ' + index, notificationStore.messages)
}

const appInfoStore = useAppInfoStore() as AppInfoStore
const appInfo = appInfoStore.state as AppInfo
const appInfoMessages = computed(
  () =>
    appInfo.messages?.map(
      (msg) =>
        ({
          id: Guid.newGuid(),
          severity: msg.severity,
          text: msg.text,
          closeable: msg?.closeable ?? true
        }) as NotificationMessage
    ) || []
)
</script>

<template>
  <div
    class="flex flex-column min-h-screen"
    v-on="globalClickHandler ? { click: props.globalClickHandler } : {}"
  >
    <Suspense>
      <div>
        <component
          :is="props.headerBootstrappedComponent.component"
          v-if="props.headerBootstrappedComponent?.component && !route.meta.hideLayout"
          ref="theHeader"
          class="fixed header-component"
          v-bind="props.headerBootstrappedComponent.props"
        ></component>
      </div>
    </Suspense>
    <div ref="appContainer" v-loading="false" class="app__container--scroll">
      <transition mode="out-in" name="app__component--transition">
        <main ref="main" class="main-div flex-grow-1 overflow-y-auto" v-if="true">
          <NotificationMessages
            v-if="appInfoMessages.length && !route.meta.hideLayout"
            :messages="appInfoMessages"
            @remove="removeMessage"
          />
          <NotificationMessages
            v-if="messages.length && !route.meta.hideLayout"
            :messages="messages"
            @remove="removeMessage"
          />
          <!--          Style margin-bottom used because icon throws alignment off by 1px -->
          <!--          <Button label="Submit2"  iconPos="right" icon="fad fa-trash-alt" style="margin-bottom: 1px" />-->
          <!--          Maybe need to do instance management using key -->
          <Suspense>
            <RouterView />
          </Suspense>
        </main>
      </transition>
    </div>
    <component
      :is="props.footerBootstrappedComponent.component"
      v-if="props.footerBootstrappedComponent?.component"
      ref="theFooter"
      class="footer-component fixed"
      v-bind="props.footerBootstrappedComponent.props"
    ></component>

    <template v-if="props.additionalComponents?.length">
      <component
        :is="additionalComponent.component"
        v-for="additionalComponent in props.additionalComponents"
        :key="additionalComponent.component.name"
        v-bind="additionalComponent.props"
      />
    </template>
  </div>
</template>

<style>
body {
  color: #111111;
  line-height: 1.7em;
  margin: 0;
}

.header-component {
  height: 36px;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.main {
  /*  margin-top: 60px; !* Same height as header *!*/
  margin-bottom: 36px; /* Same height as footer */
}

.footer-component {
  height: 36px;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

/*TODO: this sizing depends on the height of the header and footer. Should make dynamic? */
.main-div {
  margin-top: 44px;
  margin-bottom: 44px;
  padding-left: 4px;
  padding-right: 4px;
}
</style>
