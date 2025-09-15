// dispatch.ts
import type { ToolId, CommandMap } from "./types";
import { mcpToolIndex } from "./index";

// 1) Use a leading slash => project-root absolute path
const toolModules = import.meta.glob("/src/tools/**/*.mcpx.ts"); // keys look like: "/src/tools/status/bar.mcpx.ts"

const toolCache: Partial<{ [K in ToolId]: (payload: any) => Promise<any> }> = {};

export async function dispatch<K extends ToolId>(
  mcpId: K,
  payload: CommandMap[K]["props"]
): Promise<CommandMap[K]["response"]> {
  if (!toolCache[mcpId]) {
    const [namespace = "default", id] = mcpId.split(".").map(s => s.trim());
    const meta = mcpToolIndex.tools.find(t => t.id === id && t.namespace === namespace);
    if (!meta) throw new Error(`Tool not found in index: ${mcpId}`);

    // 2) Build the EXACT key the glob produced (absolute)
    // If meta.path is "src/tools/status/bar.mcpx.ts" then key must be "/src/tools/status/bar.mcpx.ts"
    const key = `/${meta.path}`;
    const loader = toolModules[key];
    if (!loader) {
      const available = Object.keys(toolModules).join("\n  - ");
      throw new Error(`No Vite loader for "${key}". Available:\n  - ${available || "(none)"}`);
    }

    const mod: any = await loader();
    toolCache[mcpId] = mod.default;
  }

  const fn = toolCache[mcpId] as ((p: CommandMap[K]["props"]) => Promise<CommandMap[K]["response"]>) | undefined;
  if (!fn) throw new Error(`Tool implementation not found: ${mcpId}`);
  return await fn(payload);
}
