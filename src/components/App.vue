<script lang="ts" setup>
// import VuescapeDialog from './VuescapeDialog.vue'
import { RouterView, useRoute } from 'vue-router'
// import CustomLoading  from './CustomLoading.vue'
import { useNotificationStore } from '../stores/useNotificationStore'
import { NotificationSeverity } from '../types/NotificationSeverity'
import type { AppComponentProps } from './AppComponentProps'
import NotificationMessages from './NotificationMessages.vue'
import VuescapeButton from './VuescapeButton.vue'

import type { NotificationStore } from '../stores'
import type { NotificationMessage } from '../types/NotificationMessage'
const notificationStore = useNotificationStore() as NotificationStore

const props = defineProps<AppComponentProps>()
const showButton = false

// setTimeout(() => {
//   notificationsStore.messages.push({ id: '1', text: 'test1', severity: NotificationSeverity.Error })
//   notificationsStore.messages.push({ id: '1', text: 'test1', severity: NotificationSeverity.Error })
//   notificationsStore.messages.push({ id: '1', text: 'test1', severity: NotificationSeverity.Error })
//   notificationsStore.messages.push({ id: '1', text: 'test1', severity: NotificationSeverity.Error })
//   notificationsStore.messages.push({ id: '1', text: 'test1', severity: NotificationSeverity.Error })
//   notificationsStore.messages.push({ id: '1', text: 'test1', severity: NotificationSeverity.Error })
//   notificationsStore.messages.push({ id: '1', text: 'test1', severity: NotificationSeverity.Error })
//   notificationsStore.messages.push({ id: '1', text: 'test1', severity: NotificationSeverity.Error })
//   notificationsStore.messages.push({ id: '1', text: 'test1', severity: NotificationSeverity.Error })
//   notificationsStore.messages.push({ id: '1', text: 'test1', severity: NotificationSeverity.Error })
//   notificationsStore.messages.push({ id: '1', text: 'test1', severity: NotificationSeverity.Error })
//   notificationsStore.messages.push({ id: '1', text: 'test1', severity: NotificationSeverity.Error })
//   notificationsStore.messages.push({ id: '1', text: 'test1', severity: NotificationSeverity.Error })
// }, 5000)
// setTimeout(() => {
//   notificationsStore.messages.push({ id: '2', text: 'test2', severity: NotificationSeverity.Warning })
//   notificationsStore.messages.push({ id: '2', text: 'test2', severity: NotificationSeverity.Warning })
//   notificationsStore.messages.push({ id: '2', text: 'test2', severity: NotificationSeverity.Warning })
//   notificationsStore.messages.push({ id: '2', text: 'test2', severity: NotificationSeverity.Warning })
//   notificationsStore.messages.push({ id: '2', text: 'test2', severity: NotificationSeverity.Warning })
//   notificationsStore.messages.push({ id: '2', text: 'test2', severity: NotificationSeverity.Warning })
//   notificationsStore.messages.push({ id: '2', text: 'test2', severity: NotificationSeverity.Warning })
//   notificationsStore.messages.push({ id: '2', text: 'test2', severity: NotificationSeverity.Warning })
//   notificationsStore.messages.push({ id: '2', text: 'test2', severity: NotificationSeverity.Warning })
//   notificationsStore.messages.push({ id: '2', text: 'test2', severity: NotificationSeverity.Warning })
//   notificationsStore.messages.push({ id: '2', text: 'test2', severity: NotificationSeverity.Warning })
// }, 1000)
// setTimeout(() => {
//   notificationsStore.messages.push({ id: '22', text: 'test22', severity: NotificationSeverity.Info })
// }, 10000)
// setTimeout(() => {
//   notificationsStore.messages.push({ id: '3333', text: 'test2222', severity: NotificationSeverity.Warning })
// }, 1000)
// setTimeout(() => {
//   notificationsStore.messages.push({ id: '22222', text: 'test22222', severity: NotificationSeverity.Warning })
// }, 1000)
// setTimeout(() => {
//   notificationsStore.messages.push({ id: '3', text: 'Success!!', severity: NotificationSeverity.Success })
// }, 8000)
const messages = notificationStore.messages as Array<NotificationMessage>
setTimeout(() => {
  messages.push({
    id: '3',
    text: 'Oh no! The  quick brown fox did NOT jump over the lazy dog :(',
    severity: NotificationSeverity.Error
  })
}, 12000)

// Function to remove a message from the list
const removeMessage = (id: string) => {
  const index = messages.findIndex((msg) => msg.id === id)
  if (index === -1) {
    return
  }
  messages.splice(index, 1)
  console.info('removed index ' + index, notificationStore.messages)
}

const route = useRoute()
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
    <!--    TODO: manage height -->
    <div ref="appContainer" v-loading="false" class="app__container--scroll">
      <!--      <CustomLoading :isVisible="true" />-->

      <!-- TODO: notifications -->
      <transition mode="out-in" name="app__component--transition">
        <main ref="main" class="main-div flex-grow-1 overflow-y-auto">
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

          <VuescapeButton v-show="showButton" />
        </main>
      </transition>
    </div>
    <component
      :is="props.footerBootstrappedComponent.component"
      v-if="props.footerBootstrappedComponent?.component"
      ref="theFooter"
      class="footer-component fixed w-full"
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
  height: 36px; /* Adjust height as needed */
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
  height: 36px; /* Adjust height as needed */
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
