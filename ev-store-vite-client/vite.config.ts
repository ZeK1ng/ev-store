import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  optimizeDeps: {
    include: ['@chakra-ui/icons', '@chakra-ui/react']
  },
  server: {
    proxy: {
      '/api/v1/image': {
        target: 'http://variance-betty-these-breach.trycloudflare.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
