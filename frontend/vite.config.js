import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  define: {
    __APP_ENV__: JSON.stringify(process.env.VITE_API_URL),
    global: {}, // <-- добавляем это
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
 server: {
    proxy: {
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/ws': {                     // 👈 Вот этого не хватает
        target: 'http://backend:8080',
        ws: true                   // 👈 Важно! Разрешает WS-прокси
      }
    },    
    allowedHosts: ['frontend']
  }
})
