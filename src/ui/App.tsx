import React from "react";
import { useApi } from "./hooks/useApi";
import { createMcpService } from "./services/mcpService";

// Add TypeScript definition for window.acquireVsCodeApi

export default function App() {
  const api = useApi();
  const mcp = createMcpService(api);

  const handleClick = async () => {
    try {
     const res = await mcp.send("editor.openVirtual", { content: "test" });
     console.log({res});
      } catch (err) {
        console.error("MCP error:", err);
      }
    };

  return (
    <div>
      <h1>Hello</h1>
      <button onClick={handleClick}>open file</button>
    </div>
  );
}
