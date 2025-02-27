import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { crx } from "@crxjs/vite-plugin";
import manifest from './src/static/manifest.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    minify: false
  }
  // build: {
  //   rollupOptions: {
  //     external: ['node:async_hooks'], // Add the necessary external modules here
  //   },
  // },
});
