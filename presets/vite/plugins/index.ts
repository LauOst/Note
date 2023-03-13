/**
 * @Description: vite
 * @Date: 2022/12/22 3:20 PM
 */
import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { AutoRegistryComponents } from './component'
import { AutoImportDeps } from './autoImport'
import { ConfigSvgIconsPlugin } from './svgIcons'

export function createVitePlugins() {
    const vitePlugins: (Plugin | Plugin[])[] = [
        vue(),
        // * vite 可以使用 jsx/tsx 语法
        vueJsx(),
        // * name 可以写在 script 标签上
        vueSetupExtend(),
        // * 自动按需引入组件
        AutoRegistryComponents(),
        // * 自动按需引入依赖
        AutoImportDeps(),
    ]
    // * 使用 svg 图标
    vitePlugins.push(ConfigSvgIconsPlugin())
    return vitePlugins
}