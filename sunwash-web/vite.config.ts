import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      __VITE_API_URL__: JSON.stringify(env.VITE_API_URL || '/api'),
    },
    plugins: [react(), tailwindcss()],
  }
})

