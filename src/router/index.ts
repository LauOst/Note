/**
 * @Description:
 * @Date: 2023/1/17 10:35 AM
 */
import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

/**
 * @description 动态路由参数配置简介
 * @param path ==> 菜单路径
 * @param name ==> 菜单别名
 * @param redirect ==> 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * @param component ==> 视图文件路径
 * @param meta ==> 菜单信息
 * @param meta.icon ==> 菜单图标
 * @param meta.title ==> 菜单标题
 * @param meta.activeMenu ==> 当前路由为详情页时，需要高亮的菜单
 * @param meta.link ==> 是否外链
 * @param meta.hidden ==> 是否隐藏
 * @param meta.breadcrumb ==> 如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
 * @param meta.affix ==> 是否固定在 tags-view
 * @param meta.noCache ==> 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
 * */

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', icon: 'user', affix: true },
      },
    ],
  },

  {
    path: '/403',
    meta: { hidden: true },
    component: () => import('@/views/error-page/403.vue'),
  },
  {
    path: '/500',
    meta: { hidden: true },
    component: () => import('@/views/error-page/500.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error-page/404.vue'),
    meta: { hidden: true },
  },
]

const router: Router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export function resetRouter() {
  const newRouter: any = router
  ;(router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
