import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'remove-figma-runtime',
      transformIndexHtml(html) {
        return html.replace(/<script[^>]*\/_runtimes\/[^"'>]*["']?[^>]*><\/script>/g, '')
      }
    }
  ],
})
