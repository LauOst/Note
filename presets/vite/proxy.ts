/**
 * @Description: 代理配置
 * @Date: 2022/8/31 11:05 AM
 */
import { ProxyOptions } from 'vite'
import { API_BASE_URL, API_TARGET_URL } from '../constant'

type ProxyTargetList = Record<string, ProxyOptions>

const init: ProxyTargetList = {
    [API_BASE_URL]: {
        // 本地 8000 前端代码的接口 代理到 8888 的服务端口
        target: API_TARGET_URL,
        changeOrigin: true, // 允许跨域
        rewrite: (path) => path.replace(new RegExp(`^${API_BASE_URL}`), ''),
    },
}

export default init