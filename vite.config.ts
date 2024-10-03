import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@apis': path.resolve(__dirname, './src/apis')
    },
  },
  optimizeDeps: {
    include: ['react-icons/fa']
  },
  define: {
    'process.env': {},
    global: {}
  }
})
