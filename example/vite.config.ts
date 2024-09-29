import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/react-three-gpu-pathtracer/',
  plugins: [react()],
  resolve: {
    alias: {
      '@react-three/gpu-pathtracer': path.resolve(__dirname, '../package/src/index.ts'),
    },
  },
})
