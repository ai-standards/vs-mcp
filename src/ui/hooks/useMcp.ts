import type { McpToolName, McpToolPayloads, McpToolResponses } from "../types/mcpTools";
import { useCallback } from "react";
import { useApi } from "./useApi";
import { McpService } from "../services/mcpService";

export function useMcp() {
  const api = useApi();
  const mcp = api ? new McpService(api) : null;

  const sendMcp = useCallback(<T extends McpToolName>(tool: T, payload: McpToolPayloads[T]) => {
    if (mcp) {
      mcp.send(tool, payload);
    }
  }, [mcp]);

  return { sendMcp };
}
