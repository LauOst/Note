/**
 * @Description:
 * @Author: Lau
 * @Date: 2022/1/11 2:36 下午
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */

export function isExternal(path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 判断url是否是http或https
 * @param {string} url
 * @returns {Boolean}
 */
export function isHttp(url: string) {
  return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
}
