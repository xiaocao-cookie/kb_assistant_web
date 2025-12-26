import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // 确保在生产环境中也能正确处理环境变量
    'process.env': {}
  }
})