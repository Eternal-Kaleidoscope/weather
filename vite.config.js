import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
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
})
