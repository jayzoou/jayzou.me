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
