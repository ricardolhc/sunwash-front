import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      __VITE_API_URL__: JSON.stringify(env.VITE_API_URL || '/api'),
      __VITE_USE_HTTP__: JSON.stringify(env.VITE_USE_HTTP !== 'false'),
      __VITE_USE_HTTP_AUTH__: JSON.stringify(env.VITE_USE_HTTP_AUTH === 'true'),
      __VITE_ADMIN_API_TOKEN__: JSON.stringify(env.VITE_ADMIN_API_TOKEN || ''),
    },
    plugins: [react(), tailwindcss()],
  }
})

