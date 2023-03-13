import NProgress from 'nprogress'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { UserStore } from '@/store/modules/user'
import { PermissionStore } from '@/store/modules/permission'

NProgress.configure({ showSpinner: false })
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const userStore = UserStore()
  const permissionStore = PermissionStore()
  const hasToken = userStore.token
  if (hasToken) {
    // 登录成功，跳转到首页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = userStore.roles.length > 0
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          await userStore.getInfo()
          const accessRoutes: any = await permissionStore.generateRoutes()
          accessRoutes.forEach((route: any) => {
            router.addRoute(route)
          })
          next({ ...to, replace: true })
        } catch (error: any) {
          userStore.logout().then(() => {
            ElMessage.error(error || 'Has Error')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          })
        }
      }
    }
  } else if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    next(`/login?redirect=${to.path}`)
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done()
})
