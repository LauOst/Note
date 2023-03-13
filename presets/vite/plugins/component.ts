/**
 * @Description: 按需加载，自动引入组件
 * @Date: 2022/12/23 10:36 AM
 */
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export const AutoRegistryComponents = () => {
    return Components({
        extensions: ['vue'],
        deep: true,
        dts: 'src/components.d.ts',
        directoryAsNamespace: false,
        globalNamespaces: [],
        directives: true,
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
        resolvers: [ElementPlusResolver()],
    })
}