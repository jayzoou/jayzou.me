import { existsSync } from 'node:fs'
import path from 'node:path'
import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import UnoCSS from "unocss/vite";

// vite-react-static reads this extension from the resolved Vite config.
interface StaticSiteConfig extends UserConfig {
  staticOptions: { script: 'defer' | 'async' }
}

const config: StaticSiteConfig = {
  base: "/",
  plugins: [
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
      remarkPlugins: [remarkGfm, remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 5000,
    // Use ws protocol and local dev port for HMR to avoid wss://localhost:443 failures
    hmr: {
      protocol: 'ws',
      clientPort: 5000,
    },
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 5000,
  },
  staticOptions: {
    script: "defer",
  },
};

export default defineConfig(config);
