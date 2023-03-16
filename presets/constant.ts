/**
 * @Description: 项目配置
 * @Date: 2022/8/31 11:04 AM
 */

// serve
export const API_BASE_URL = '/api'
// export const API_TARGET_URL = 'https://mock.mengxuegu.com/mock/640ae1bc4689d550adbe0a40/note'
export const API_TARGET_URL = 'http://localhost:3000/api'

// title
export const VITE_GLOB_APP_TITLE = 'DZICS-Admin'

// port
export const VITE_PORT = 3308
// open 运行 npm run dev 时自动打开浏览器
export const VITE_OPEN = true

// 是否生成包分析文件
export const VITE_REPORT = false

// 是否开启gzip压缩
export const VITE_BUILD_GZIP = false

// 是否删除生产环境 console
export const VITE_DROP_CONSOLE = true


// cookie名称
export class Keys {
    static TokenKey = 'token'

    static Sub = 'dz_sub'

    static Code = 'code'

    static languageKey = 'languageKey'
}