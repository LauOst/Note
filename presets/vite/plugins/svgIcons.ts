/**
 * @Description: 加载SVG文件，自动引入
 * @Date: 2022/12/23 10:44 AM
 */
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import * as path from 'path'

export const ConfigSvgIconsPlugin = () => {
    return createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
    })
}