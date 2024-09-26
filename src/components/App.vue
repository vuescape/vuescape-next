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
const notificationStore: NotificationStore = useNotificationStore()

const props = defineProps<AppComponentProps>()
const showButton = false

// import TheFooter from './components/TheFooter.vue'
//  import TheHeader from './components/TheHeader.vue'

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
setTimeout(() => {
  notificationStore.messages.push({
    id: '3',
    text: 'Oh no! The  quick brown fox did NOT jump over the lazy dog :(',
    severity: NotificationSeverity.Error
  })
}, 12000)

// Function to remove a message from the list
const removeMessage = (id: string) => {
  const index = notificationStore.messages.findIndex((msg) => msg.id === id)
  if (index === -1) {
    return
  }
  notificationStore.messages.splice(index, 1)
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
            v-if="notificationStore.messages.length && !route.meta.hideLayout"
            :messages="notificationStore.messages"
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

    <component
      :is="additionalComponent.component"
      v-for="additionalComponent in props.additionalComponents"
      v-if="props.additionalComponents?.length"
      :key="additionalComponent.component.name"
      v-bind="additionalComponent.props"
    />
  </div>
  <!--  <TheHeader-->
  <!--    ref="theHeader"-->
  <!--    style="height: 36px; background-color: #f5f5f5; top: 0; border-bottom: 1px solid #9bdddb"-->
  <!--  ></TheHeader>-->
  <!--  <TheFooter-->
  <!--    ref="theFooter"-->
  <!--    style="-->
  <!--      height: 36px;-->
  <!--      background-color: #f5f5f5;-->
  <!--      top: calc(100vh - 36px);-->
  <!--      width: 100%;-->
  <!--      border-top: 1px solid #9bdddb;-->
  <!--    "-->
  <!--  ></TheFooter>-->
</template>

<style>
/* TODO: Set this as css variable for theme */
body {
  /*  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;*/
  color: #111111;
  line-height: 1.7em;
  margin: 0;
}

/*
html {
  overflow-y: hidden;
}

body {
  color: #111111;
  line-height: 1.7em;
  margin: 0;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: #b4b4b4;
}

main {
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

.app__component--transition-enter-active,
.app__component--transition-leave-active {
  transition: opacity 0.3s ease;
}

.app__component--transition-enter,
.app__component--transition-leave-to {
  opacity: 0;
}
*/

/*.app__container--scroll {
  overflow-y: auto;
  height: calc(100vh - 72px);
  padding: 0 var(--section-gap);
}*/
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
