import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://e-chat-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'https://e-chat-production.up.railway.app',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  },
  define: {
    global: {}
  }
})
