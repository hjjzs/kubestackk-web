import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy:{
      '/api': {
        target: 'https://10.255.9.184:6443/',
        secure: false,
        ws: true,
        changeOrigin: true
      }
     
    }
  }
 
})
