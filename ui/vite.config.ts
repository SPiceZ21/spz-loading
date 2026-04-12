import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Essential for FiveM NUI
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
