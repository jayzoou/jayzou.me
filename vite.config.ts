import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import {babel} from '@rollup/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  publicDir: 'pages',
  build: {
  },
  plugins: [
    react(),
    tailwindcss(),
    mdx({
      jsxImportSource: 'react',
    }),
    babel({
      // Also run on what used to be `.mdx` (but is now JS):
      extensions: ['.js', '.jsx', '.cjs', '.mjs', '.md', '.mdx']
      // Other options…
    })
  ],
})
