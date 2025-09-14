
import { useEffect, useRef } from "react";

export type VsCodeApi = {
  postMessage: (message: any) => void;
  onMessage: (handler: (message: any) => void) => void;
  offMessage: (handler: (message: any) => void) => void;
};

export function useApi(): VsCodeApi | null {
  const vsApi = typeof window !== "undefined" && (window as any).acquireVsCodeApi
    ? (window as any).acquireVsCodeApi()
    : null;

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
