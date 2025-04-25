import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      __WS_TOKEN__: JSON.stringify(env.VITE_WS_TOKEN || 'development')
    },
    server: {
      port: 5174,
      strictPort: true,
      open: true
    }
  }
})
