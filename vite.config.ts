import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  publicDir: 'pages',
  plugins: [
    react(),
    tailwindcss(),
    mdx({
      jsxImportSource: 'react',
    })
  ],
})
