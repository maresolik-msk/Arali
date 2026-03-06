import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      // Strip Figma Make runtime scripts injected into index.html.
      // These scripts (/_runtimes/*.js) only exist inside Figma's
      // environment and cause Rollup to crash during Vercel builds.
      name: 'remove-figma-runtime',
      transformIndexHtml(html) {
        return html.replace(/<script[^>]*\/_runtimes\/[^"'>]*["']?[^>]*><\/script>/g, '')
      }
    }
  ],
})
```

---

**Step 3 — Commit**

Scroll down, set the commit message to:
```
fix: strip Figma runtime script tag to unblock Vercel build
