// useMcpServer.ts
import { useCallback, useRef, useState } from "react";
import { useApi } from "./useApi";
import { McpService } from "../services/mcpService";
import type {
  ToolId,
  CommandMap,
  PropsFor,
  ResponseFor,
} from "../../server/types"; // generated file

type CallState = "idle" | "loading" | "success" | "error";

type UseMcpServerOptions = {
  onBeforeCall?: <K extends keyof CommandMap>(name: K, args: PropsFor<K>) => void;
  onAfterCall?: <K extends keyof CommandMap>(
    name: K,
    args: PropsFor<K>,
    result: ResponseFor<K> | undefined,
    error: unknown | undefined
  ) => void;
};

export function useMcpServer(opts?: UseMcpServerOptions) {
  const [status, setStatus] = useState<CallState>("idle");
  const [error, setError] = useState<unknown>();
  const lastTool = useRef<ToolId | null>(null);
  const lastArgs = useRef<PropsFor<ToolId> | null>(null);
  const lastResult = useRef<ResponseFor<ToolId> | null>(null);


  // Use VS Code API for posting messages
  const api = useApi();
  const mcpService = new McpService(api);

  async function _dispatchMcp<K extends keyof CommandMap>(name: K, args: PropsFor<K>): Promise<ResponseFor<K>> {
    if (!api) throw new Error("VS Code API not available");
    return new Promise<ResponseFor<K>>((resolve, reject) => {
      function handleMessage(event: MessageEvent) {
        const { mcpId, result, error } = event.data || {};
        if (mcpId === name) {
          window.removeEventListener("message", handleMessage);
          if (error) reject(error);
          else resolve(result);
        }
      }
      window.addEventListener("message", handleMessage);
      mcpService.send(name as any, args as any);
    });
  }

  const callTool = useCallback(
    async <K extends keyof CommandMap>(name: K, args: PropsFor<K>) => {
      setStatus("loading");
      setError(undefined);
      lastTool.current = name as ToolId;
      lastArgs.current = args as PropsFor<ToolId>;
      opts?.onBeforeCall?.(name, args);

      try {
        const result = await _dispatchMcp(name, args);
        lastResult.current = result as ResponseFor<ToolId>;
        setStatus("success");
        opts?.onAfterCall?.(name, args, result, undefined);
        return result;
      } catch (err) {
        setError(err);
        setStatus("error");
        opts?.onAfterCall?.(name, args, undefined, err);
        throw err;
      }
    },
    [opts, api]
  );

  return {
    callTool,   // <K extends ToolId>(name: K, args: PropsFor<K>) => Promise<ResponseFor<K>>
    status,     // "idle" | "loading" | "success" | "error"
    error,      // last error if any
    lastTool,   // ref to last tool id
    lastArgs,   // ref to last args
    lastResult, // ref to last result
  };
}
