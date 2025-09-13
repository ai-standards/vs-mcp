import { useEffect, useRef } from "react";

export interface VsCodeApi {
  postMessage: (message: any) => void;
  // Add other methods if needed
}

export function useApi(onMessage?: (message: any) => void): VsCodeApi | null {
  // Only acquire the API once
  const apiRef = useRef<VsCodeApi | null>(
    typeof window !== "undefined" && (window as any).acquireVsCodeApi
      ? (window as any).acquireVsCodeApi()
      : null
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (onMessage) {
        onMessage(event.data);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onMessage]);

  return apiRef.current;
}
