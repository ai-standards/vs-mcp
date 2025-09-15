// src/extension.ts
import runAgent from "@/tools/agent/run-agent.mcpx";
import * as vscode from "vscode";

export async function activateRunAgent(context: vscode.ExtensionContext) {
  const runAgentDisposable = vscode.commands.registerCommand("vs-mcp.runAgent", async (fileUri: vscode.Uri) => {
      const res = await runAgent({
        filepath: fileUri.fsPath
      });

      context.subscriptions.push(runAgentDisposable);
    });
}