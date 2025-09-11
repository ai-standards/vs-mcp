import { defineConfig } from "vite";
import { resolve } from "path";
import { builtinModules } from "module";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/extension.ts"),
      name: "vs-mcp",
      fileName: "extension",
      formats: ["es"],
    },
    outDir: "out",
    rollupOptions: {
      external: [
        "vscode",
        "path",
        "url",
        // all node built-ins (both forms)
        ...builtinModules,
        ...builtinModules.map((m) => `node:${m}`),
      ],
      output: {
        globals: {
          vscode: "vscode",
        },
      },
    },
    // VS Code runs on Node — target its runtime (Node 18+ is typical; keep 16 if you must)
    target: "node16",
    minify: false,
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
