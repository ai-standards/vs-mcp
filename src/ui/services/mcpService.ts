import { McpToolName, McpToolPayloads, McpToolResponses } from "../types/mcpTools";

export class McpService {
  private api: { postMessage: (message: any) => void } | null;

  constructor(api: { postMessage: (message: any) => void } | null) {
    this.api = api;
  }

  send<T extends McpToolName>(tool: T, payload: McpToolPayloads[T]) {
    if (!this.api) throw new Error("VS Code API not available");
    this.api.postMessage(
      JSON.stringify({ type: tool, ...payload })
    );
  }
}
