// vite.config.webview.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, join } from "path";
import { readdirSync, statSync, existsSync } from "fs";

function getUiEntries(root = "src/ui") {
  const abs = resolve(process.cwd(), root);
  const entries: Record<string, string> = {};
  for (const name of readdirSync(abs)) {
    const dir = join(abs, name);
    if (!statSync(dir).isDirectory()) continue;
    const tsx = join(dir, "main.tsx");
    const ts = join(dir, "main.ts");
    const entry = existsSync(tsx) ? tsx : existsSync(ts) ? ts : null;
    if (entry) entries[name] = entry;
  }
  return entries;
}

export default defineConfig({
  plugins: [react()],
  base: "",
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    build: {
      outDir: "media/ui",          // <-- moved out of /out
      emptyOutDir: true,
      target: "es2020",
      rollupOptions: {
        input: getUiEntries(),
        output: {
          entryFileNames: `[name]/main.js`,
          chunkFileNames: `[name]/chunks/[name].js`,
          assetFileNames: `[name]/assets/[name][extname]`
        }
      }
    }
});
