import React from "react";
import { useApi } from "./hooks/useApi";

// Add TypeScript definition for window.acquireVsCodeApi

export default function App() {
  const api = useApi((message) => {
    if (message.type === "pong") {
      console.log(message.text);
    }
  });
  React.useEffect(() => {
    api?.postMessage({ type: "ping" });
  }, [api]);
  return <div style={{ padding: 16 }}>Hello from VS-MCP React Webview!</div>;
}
