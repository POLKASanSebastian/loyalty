import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/loyalty/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        staff: 'staff.html',
      }
    }
  }
})
