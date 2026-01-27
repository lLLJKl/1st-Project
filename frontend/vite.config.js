import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    host: true,
    proxy:{
      "/api":{
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  }, 
  resolve: {
    alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url))
    },
  },
})
