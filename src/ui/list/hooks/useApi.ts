
import { useEffect, useRef } from "react";

export type VsCodeApi = {
  postMessage: (message: any) => void;
  onMessage: (handler: (message: any) => void) => void;
  offMessage: (handler: (message: any) => void) => void;
};

let cachedVsApi: any = null;
if (typeof window !== "undefined" && (window as any).acquireVsCodeApi) {
  if (!cachedVsApi) {
    cachedVsApi = (window as any).acquireVsCodeApi();
  }
}

export function useApi(): VsCodeApi | null {
  const vsApi = cachedVsApi;

  const listeners = useRef<Set<(message: any) => void>>(new Set());

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      listeners.current.forEach(fn => fn(event.data));
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const api: VsCodeApi | null = vsApi
    ? {
        postMessage: (msg: any) => vsApi.postMessage(msg),
        onMessage: (fn: (message: any) => void) => listeners.current.add(fn),
        offMessage: (fn: (message: any) => void) => listeners.current.delete(fn),
      }
    : null;

  return api;
}
