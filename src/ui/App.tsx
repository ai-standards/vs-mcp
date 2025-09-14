import React from "react";
import { useApi } from "./hooks/useApi";
import { createMcpService } from "./services/mcpService";
import { Button } from "./toolkit";

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
      <Button onClick={handleClick}>open file</Button>
    </div>
  );
}
