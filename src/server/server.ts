
import type { ToolId, CommandMap } from "./types";
import { mcpToolIndex } from "./index";

// Lazy-load tool implementations using dynamic import
const toolCache: Partial<{ [K in ToolId]: (payload: any) => Promise<any> }> = {};

export async function dispatch<K extends ToolId>(mcpId: K, payload: CommandMap[K]["props"]): Promise<CommandMap[K]["response"]> {
	if (!toolCache[mcpId]) {
		const [namespace = 'default', id] = mcpId.split('.').map(s => s.trim());
		const toolMeta = mcpToolIndex.tools.find(t => t.id === id && t.namespace === namespace);
		if (!toolMeta) throw new Error(`Tool not found in index: ${mcpId}`);
	// Dynamic import, relative to server directory
	const mod = await import(/* @vite-ignore */ `../${toolMeta.path}`);
		toolCache[mcpId] = mod.default;
	}
	const fn = toolCache[mcpId] as ((payload: CommandMap[K]["props"]) => Promise<CommandMap[K]["response"]>) | undefined;
	if (!fn) throw new Error(`Tool implementation not found: ${mcpId}`);
	return await fn(payload);
}
