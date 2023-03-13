<template>
  <div v-if="!item.meta || !item.meta.hidden">
    <template
      v-if="
        !alwaysShowRootMenu && theOnlyOneChild && (!theOnlyOneChild?.children || theOnlyOneChild?.noShowingChildren)
      "
    >
      <SidebarItemLink v-if="theOnlyOneChild?.meta" :to="resolvePath(theOnlyOneChild?.path)">
        <el-menu-item :index="resolvePath(theOnlyOneChild?.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <svg-icon :icon-class="theOnlyOneChild?.meta.icon" />
          <template v-if="theOnlyOneChild?.meta.title" #title>{{ theOnlyOneChild?.meta.title }}</template>
        </el-menu-item>
      </SidebarItemLink>
    </template>
    <el-sub-menu v-else :index="resolvePath(item.path)">
      <template #title>
        <svg-icon :icon-class="item.meta && item.meta.icon" />
        <span v-if="item.meta && item.meta.title">{{ item.meta.title }}</span>
      </template>
      <template v-if="item.children">
        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :is-nest="true"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </template>
    </el-sub-menu>
  </div>
</template>

<script lang="ts" setup>
import path from 'path-browserify'
import { PropType } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import SidebarItemLink from './SidebarItemLink.vue'
import { isExternal } from '@/utils/validate'

const props = defineProps({
  item: {
    type: Object as PropType<RouteRecordRaw>,
    required: true,
  },
  // 用于判断是不是子Item,设置响应的样式
  isNest: {
    type: Boolean,
    default: false,
  },
  basePath: {
    type: String,
    required: true,
  },
})

/* sidebar相关处理 */
// Function
const alwaysShowRootMenu = computed(() => !!(props.item.meta && props.item.meta.alwaysShow))
// 返回children数量，没有则返回0
const showingChildNumber = computed(() => {
  if (props.item.children) {
    const showingChildren = props.item.children.filter((item) => {
      return !(item.meta && item.meta.hidden)
    })
    return showingChildren.length
  }
  return 0
})
// 根据children数量做相应处理
const theOnlyOneChild = computed(() => {
  if (showingChildNumber.value > 1) {
    return null
  }
  if (showingChildNumber.value === 0) {
    return { ...props.item, path: '', noShowingChildren: true }
  }
  if (props.item.children) {
    for (const child of props.item.children) {
      if (!child.meta || !child.meta.hidden) {
        return child
      }
    }
  }
  return { ...props.item, path: '' }
})
const resolvePath = (routePath: string) => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  return path.resolve(props.basePath, routePath)
}
</script>
