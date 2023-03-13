/**
 * @Description: 登录和权限相关
 * @Date: 2023/1/17 2:41 PM
 */
import { Login } from '@/typings/api/modules/login'
import http from '@/api'

export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(`/login`, params)
}

// * 获取个人信息
export const getInfoApi = () => {
  return http.get<any>(`/userInfo`)
}
// * 获取菜单列表
export const getAuthRouterListApi = () => {
  // return http.get<Menu.MenuOptions[]>(`/api/user/auth/getRouters`)
  return http.get<any>(`/menu/list`)
}

// * 用户退出登录
export const logoutApi = () => {
  return http.post(`/logout`)
}
