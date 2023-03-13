/**
 * @Description: axios配置
 * @Date: 2023/1/17 1:51 PM
 */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ResultEnum } from '@/typings/httpEnum'
import { checkStatus } from '@/api/helper/checkStatus'
import { UserStore } from '@/store/modules/user'
import router from '@/router'
import { ResultData } from '@/typings/api/ResResult'
import { getToken } from '@/utils/auth'

const config = {
  // 默认地址请求地址，可在 .env 开头文件中修改
  baseURL: import.meta.env.VITE_API_URL as string,
  // 设置超时时间（10s）
  timeout: ResultEnum.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: true,
}

class RequestHttp {
  service: AxiosInstance

  public constructor(config: AxiosRequestConfig) {
    this.service = axios.create(config)
    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
     */
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = getToken()
        if (config.headers && typeof config.headers?.set === 'function') config.headers.set('x-access-token', token)
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      },
    )
    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { code, msg } = response.data
        // * 直接返回（code == 0）
        if (code === ResultEnum.SUCCESS) {
          return response.data
        }

        // * 登陆失效（code == 402 | 408）
        if (code === ResultEnum.OVERDUE || code === 408) {
          ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            UserStore()
              .logout()
              .then(() => {
                router.replace('/index').catch()
                // location.href = '/index'
              })
          })
        } else {
          if (response.data instanceof ArrayBuffer) {
            return response
          }
          ElMessage.error(msg)
        }
        return response.data
      },
      async (error: AxiosError) => {
        const { response } = error
        // 请求超时单独判断，因为请求超时没有 response
        if (error.message.indexOf('timeout') !== -1) ElMessage.error('请求超时！请您稍后重试')
        // 根据响应的错误状态码，做不同的处理
        if (response) checkStatus(response.status)
        // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
        // if (!window.navigator.onLine) router.replace('/500').catch()
        return Promise.reject(error)
      },
    )
  }

  // * 常用请求方法封装
  get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.get(url, { params, ..._object })
  }

  post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.post(url, params, _object)
  }

  put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.put(url, params, _object)
  }

  delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
    return this.service.delete(url, { params, ..._object })
  }
}

export default new RequestHttp(config)
