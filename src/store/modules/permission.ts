import { RouteRecordRaw } from 'vue-router'
import { PermissionState } from '@/typings/store/permission'
import { constantRoutes } from '@/router'
import { asyncJsonRoutes } from '@/utils/routeHelper'
import { getAuthRouterListApi } from '@/api/modules/login'

export const PermissionStore = defineStore({
  id: 'PermissionState',
  state: (): PermissionState => ({
    routes: [],
    // routes: constantRoutes,
    addRoutes: [],
    sidebarRouters: [],
  }),
  actions: {
    setRoutes(routes: RouteRecordRaw[]) {
      this.addRoutes = routes
      this.routes = constantRoutes.concat(routes)
    },
    setSidebarRouters(routes: RouteRecordRaw[]) {
      this.sidebarRouters = routes
    },
    // 获取路由
    async generateRoutes() {
      return new Promise((resolve, reject) => {
        getAuthRouterListApi()
          .then((response: any) => {
            const asyncRoutes = response.data
            const accessedRoutes = asyncJsonRoutes(asyncRoutes)
            this.setRoutes(accessedRoutes)
            resolve(accessedRoutes)
          })
          .catch((error: any) => {
            reject(error)
          })
      })
    },
  },
})
