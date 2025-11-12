import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// KHÔNG cần import tailwindPostcss và autoprefixer ở đây nữa

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Xóa bỏ hoàn toàn mục 'css'
  // Vite sẽ tự động tìm thấy file postcss.config.js
})