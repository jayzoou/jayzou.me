import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import UnoCSS from "unocss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    UnoCSS(),
    mdx({
      jsxImportSource: "react",
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 5000,
    hmr: {
      clientPort: 443,
      protocol: "wss",
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
