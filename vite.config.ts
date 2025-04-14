import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import UnoCSS from 'unocss/vite'
 
// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    UnoCSS(),
    mdx({
      jsxImportSource: 'react',
    }),
  ],
})
