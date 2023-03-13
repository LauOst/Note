/**
 * @Description: 按需加载，自动引入
 * @Date: 2022/12/23 10:34 AM
 */
import AutoImport from 'unplugin-auto-import/vite'

export const AutoImportDeps = () => {
    return AutoImport({
        dts: 'src/auto-imports.d.ts',
        imports: ['vue', 'pinia', 'vue-router', '@vueuse/core'],
        vueTemplate: true,
        eslintrc: {
            enabled: true, // Default `false`
            filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
            globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
    })
}