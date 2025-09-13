// mcp/compose.ts
import { McpServer, McpTool, McpResource } from "./types";

export function composeServers(...servers: McpServer[]): McpServer {
  return {
    async listTools(): Promise<McpTool[]> {
      const all = await Promise.all(servers.map(s => s.listTools()));
      const list = all.flat();
      // Optional: de-dupe by name
      const map = new Map(list.map(t => [t.name, t]));
      return [...map.values()];
    },
    async listResources(): Promise<McpResource[]> {
      const all = await Promise.all(servers.map(s => s.listResources()));
      const list = all.flat();
      const map = new Map(list.map(r => [r.name, r]));
      return [...map.values()];
    }
  };
}
