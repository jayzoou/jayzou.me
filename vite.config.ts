import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import UnoCSS from "unocss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    UnoCSS(),
    mdx({
      jsxImportSource: "react",
      remarkPlugins: [remarkMath],
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
  // @ts-ignore
  staticOptions: {
    script: "defer",
  },
});
