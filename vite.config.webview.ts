import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname, "src/ui"),
  build: {
    outDir: path.resolve(__dirname, "media/webview"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "src/ui/main.tsx"),
      output: {
        entryFileNames: "main.js"
      }
    }
  },
  plugins: [react()]
});
