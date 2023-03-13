import { getToken, setToken, removeToken } from '@/utils/auth'
import { UserState } from '@/typings/store/user'
import { Login } from '@/typings/api/modules/login'
import { getInfoApi, loginApi, logoutApi } from '@/api/modules/login'
import { resetRouter } from '@/router'

export const UserStore = defineStore({
  id: 'UserState',
  state: (): UserState => ({
    // token
    token: getToken() || '',
    roles: [],
    permissions: [],
    departOptions: [],
  }),
  actions: {
    SET_TOKEN_Sub(info: any) {
      this.token = info
    },
    RESET_STATE() {
      this.$reset()
    },

    // 登录
    async login(userInfo: Login.ReqLoginForm) {
      const { username, password } = userInfo
      const response = await loginApi({ username: username.trim(), password })
      if (response) {
        const accessToken = response.data.access_token
        this.SET_TOKEN_Sub(accessToken)
        setToken(accessToken)
      }
      return response
    },
    // 获取用户信息
    async getInfo() {
      const { data } = await getInfoApi()
      const { roles, permissions } = data
      this.roles = roles
      this.permissions = permissions
      return data
    },

    // 注销
    async logout() {
      const response = await logoutApi()
      if (response) {
        removeToken()
        this.RESET_STATE()
        resetRouter()
      }
      return response
    },

    // 清除 Token
    resetToken() {
      return new Promise((resolve) => {
        removeToken()
        this.RESET_STATE()
        resolve(null)
      })
    },
  },
})
