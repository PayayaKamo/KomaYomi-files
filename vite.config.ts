import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  // GitHub Pages 项目站点挂在 /<repo>/ 子路径下，由 workflow 注入 VITE_BASE；
  // 本地与其他静态托管默认使用根路径。
  base: process.env.VITE_BASE || '/',
  server: {
    port: 5273,
    strictPort: true,
    host: true,
  },
  // 仅在构建时生效：移除 console/debugger、去掉所有注释（dev 模式不受影响）
  esbuild:
    command === 'build'
      ? {
          drop: ['console', 'debugger'],
          legalComments: 'none',
        }
      : undefined,
  build: {
    // 显式关闭 sourcemap，防止打包时意外泄露源码
    sourcemap: false,
    // esbuild 压缩：默认就会做变量名混淆 + 代码压缩
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // 框架代码单独分包，业务改动不影响框架包的浏览器缓存
        manualChunks: {
          vendor: ['vue', 'vue-router'],
        },
      },
    },
  },
}))
