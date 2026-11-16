import { existsSync } from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeShiki from '@shikijs/rehype'
import rehypeHeadings from './scripts/rehype-headings.ts'
import UnoCSS from "unocss/vite";

// vite-react-static reads this extension from the resolved Vite config.
interface StaticSiteConfig extends UserConfig {
  staticOptions: { script: 'defer' | 'async' }
}

export default defineConfig(({ mode }) => {
const env = loadEnv(mode, process.cwd(), '')
const proxy = { '/api': { target: env.AI_PROXY_TARGET || 'http://127.0.0.1:8787', changeOrigin: true } }
const config: StaticSiteConfig = {
  base: "/",
  build: { target: 'es2022', manifest: true },
  plugins: [
    {
      name: 'page-modules',
      resolveId(id) { if (id === 'virtual:pages') return '\0virtual:pages' },
      load(id, options) {
        if (id !== '\0virtual:pages') return
        return options?.ssr
          ? "export const eagerPages = import.meta.glob('/pages/**/*.mdx', { eager: true }); export const lazyPages = {}"
          : "export const eagerPages = {}; export const lazyPages = import.meta.glob('/pages/**/*.mdx')"
      },
    },
    {
      name: 'static-directory-preview',
      configurePreviewServer(server) {
        const dist = path.resolve(server.config.root, server.config.build.outDir)
        server.middlewares.use((req, res, next) => {
          if (!req.url || !['GET', 'HEAD'].includes(req.method || '')) return next()
          try {
            const url = new URL(req.url, 'http://localhost')
            const index = path.resolve(dist, `.${decodeURIComponent(url.pathname)}`, 'index.html')
            if (index.startsWith(`${dist}${path.sep}`) && existsSync(index) && !url.pathname.endsWith('/')) {
              // Match directory-based static hosting instead of falling back to the home page.
              res.writeHead(308, { Location: `${url.pathname}/${url.search}` })
              res.end()
              return
            }
          } catch {
            res.statusCode = 400
            res.end('Invalid URL')
            return
          }
          next()
        })
      },
    },
    react(),
    UnoCSS(),
    mdx({
      jsxImportSource: "react",
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [rehypeKatex, [rehypeShiki, { theme: 'github-dark', fallbackLanguage: 'text' }], rehypeHeadings],
    }),
  ],
  server: {
    proxy,
    host: "0.0.0.0",
    port: 5000,
    // Let Vite use the actual listening port if 5000 is occupied.
    hmr: {
      protocol: 'ws',
    },
    allowedHosts: true,
  },
  preview: {
    proxy,
    host: "0.0.0.0",
    port: 5000,
  },
  staticOptions: {
    script: "defer",
  },
};

return config
});
