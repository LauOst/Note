<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :background-color="variable.menuBg"
        :text-color="variable.menuText"
        :active-text-color="variable.menuActiveText"
        :collapse="isCollapse"
        :collapse-transition="false"
        :unique-opened="false"
        mode="vertical"
      >
        <SidebarItem v-for="item in routes" :key="item.path" :item="item" :base-path="item.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import SidebarItem from './SidebarItem.vue'
import variables from '@/assets/styles/variables.module.scss'
import { PermissionStore } from '@/store/modules/permission'
import { AppStore } from '@/store/modules/app'

const appStore = AppStore()
const permissionStore = PermissionStore()
// 公共css
const variable = computed(() => variables)
// 默认选中
const route = useRoute()
const activeMenu = computed(() => {
  const { meta, fullPath } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return fullPath
})
// 路由列表
const routes = computed(() => permissionStore.routes)
// 折叠sidebar
const isCollapse = computed(() => !appStore.sidebar.opened)
</script>

<style lang="scss" scoped></style>
