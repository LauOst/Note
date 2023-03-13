import { ConfigEnv, defineConfig, loadEnv, UserConfig } from 'vite'
import { resolve } from 'path'
import { createVitePlugins } from './presets/vite/plugins'
import proxy from './presets/vite/proxy'
import { VITE_PORT, VITE_OPEN, VITE_DROP_CONSOLE } from './presets/constant'

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV } = env
  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'), // 把 @ 指向到 src 目录去
      },
    },
    plugins: createVitePlugins(),
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    // 服务设置
    server: {
      host: true, // host设置为true才可以使用network的形式，以ip访问项目
      port: VITE_PORT, // 端口号
      open: VITE_OPEN, // 自动打开浏览器
      cors: true, // 跨域设置允许
      strictPort: true, // 如果端口已占用直接退出
      // 接口代理
      proxy,
    },
    // * 打包去除 console.log && debugger
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
    },
    build: {
      outDir: 'dist',
      minify: 'esbuild',
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          // Static resource classification and packaging
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
  }
})
