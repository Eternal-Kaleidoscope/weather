import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => {
  // 根据环境自动设置基础路径
  const base = mode === 'production' 
    ? process.env.VITE_BASE_URL || '/wearther/'
    : '/'

  return {
    plugins: [vue()],
    // 设置基础路径 - 用于GitHub Pages部署
    base,
    server: {
      port: 3000,
      open: true
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue'],
            api: ['axios']
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  }
})
