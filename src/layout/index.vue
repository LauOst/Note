<template>
  <div :class="classObj" class="app-wrapper">
    <Sidebar class="sidebar-container" />
    <div class="main-container">
      <div>
        <Navbar />
        <TagsView />
      </div>
      <AppMain />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppMain, Sidebar, Navbar, TagsView } from './components'

import { AppStore } from '@/store/modules/app'

const appStore = AppStore()
const classObj = computed(() => {
  return {
    hideSidebar: !appStore.sidebar.opened,
    openSidebar: appStore.sidebar.opened,
    withoutAnimation: appStore.sidebar.withoutAnimation,
  }
})
</script>

<style lang="scss" scoped>
@import '../assets/styles/variables.module.scss';
.app-wrapper {
  &:after {
    content: '';
    display: table;
    clear: both;
  }
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}
</style>
