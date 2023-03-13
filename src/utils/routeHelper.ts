/**
 * @Description:
 * @Author: Lau
 * @Date: 2022/3/14 8:49 AM
 */
import { RouteRecordRaw } from 'vue-router'
import layout from '@/layout/index.vue'
import ParentView from '@/components/ParentView/index.vue'

const modules = import.meta.glob('./../views/**/*.vue')

export const loadView = (view: any) => {
  let res
  // eslint-disable-next-line guard-for-in
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0]
    if (dir === view) {
      res = () => modules[path]()
    }
  }
  return res
}

export const asyncJsonRoutes = (routes: any) => {
  const asyncRouters: RouteRecordRaw[] = routes.filter((route: any) => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else {
        route.component = loadView(route.component)
      }
    }
    // 如果有子路由，递归添加
    if (route.children && route.children.length) {
      asyncJsonRoutes(route.children)
    }
    return true
  })
  return asyncRouters
}
