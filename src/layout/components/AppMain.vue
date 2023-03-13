<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive v-if="!hideKeepAlive" :include="cachedViews">
          <component :is="Component" :key="route.path" />
        </keep-alive>
        <component :is="Component" v-else :key="route.path" />
      </transition>
    </router-view>
  </section>
</template>

<script lang="ts" setup>
import { TagsViewStore } from '@/store/modules/tagsView'

const tagsViewStore = TagsViewStore()
const cachedViews = computed(() => tagsViewStore.cachedViews)
const hideKeepAlive = import.meta.env?.MODE === 'development'
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  height: calc(100vh - 84px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }
  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>
