// mcp/servers/uiServer.ts
import * as vscode from "vscode";
import { McpServer, McpTool, McpResource } from "../types";

const tools: McpTool[] = [
  {
    name: "ui.info",
    description: "Show info message with optional actions.",
    schema: { message: "string", actions: "string[]?" },
    async call(args) {
      const { message, actions } = (args as any) ?? {};
      const choice = await vscode.window.showInformationMessage(String(message ?? ""), ...(actions ?? []));
      return { choice: choice ?? null };
    },
  },
  {
    name: "ui.warn",
    description: "Show warning message.",
    schema: { message: "string", actions: "string[]?" },
    async call(args) {
      const { message, actions } = (args as any) ?? {};
      const choice = await vscode.window.showWarningMessage(String(message ?? ""), ...(actions ?? []));
      return { choice: choice ?? null };
    },
  },
  {
    name: "ui.input",
    description: "Prompt user for a string.",
    schema: { prompt: "string", placeHolder: "string?=" },
    async call(args) {
      const { prompt, placeHolder } = (args as any) ?? {};
      const value = await vscode.window.showInputBox({ prompt: String(prompt ?? ""), placeHolder: placeHolder ? String(placeHolder) : undefined });
      return { value: value ?? null };
    },
  },
];

export function createUiServer(): McpServer {
  return {
    async listTools() { return tools; },
    async listResources() { return [] as McpResource[]; },
  };
}
