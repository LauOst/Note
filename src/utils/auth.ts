/**
 * @Description: Cookies相关配置
 * @Date: 2023/1/17 11:25 AM
 */
import Cookies from 'js-cookie'
import { Keys } from '../../presets/constant'

// token
export const getToken = () => Cookies.get(Keys.TokenKey)
export const setToken = (token: string) => Cookies.set(Keys.TokenKey, token)
export const removeToken = () => Cookies.remove(Keys.TokenKey)

// sub
export const getSub = () => Cookies.get(Keys.Sub)
export const setSub = (sub: string) => Cookies.set(Keys.Sub, sub)
export const removeSub = () => Cookies.remove(Keys.Sub)

// code
export const getCode = () => Cookies.get(Keys.Code)
export const setCode = (code: string) => Cookies.set(Keys.Code, code)
export const removeCode = () => Cookies.remove(Keys.Code)
