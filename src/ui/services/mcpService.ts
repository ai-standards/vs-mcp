import { nanoid } from "nanoid";
import type { ToolId, CommandMap } from "../../server/types";

export function createMcpService(api: {
  postMessage: (message: any) => void;
  onMessage?: (handler: (message: any) => void) => void;
  offMessage?: (handler: (message: any) => void) => void;
} | null) {
  async function send<K extends ToolId>(tool: K, payload: CommandMap[K]["props"]): Promise<CommandMap[K]["response"]> {
    if (!api) throw new Error("VS Code API not available");
    const uniqueId = nanoid();
    return new Promise<CommandMap[K]["response"]>((resolve, reject) => {
      const handler = (msg: any) => {
        const {mcp} = msg;
        if (! mcp) {
          return;
        }
        const { requestId, result, error } = mcp || {};
        if (requestId === uniqueId) {
          api?.offMessage?.(handler);
          if (error) reject(error);
          else resolve(result);
        }
      };
      api.onMessage?.(handler);
      api.postMessage({ mcp: {mcpId: tool, payload, requestId: uniqueId} });
    });
  }
  return { send };
}
