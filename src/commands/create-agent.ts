// src/lib/commands/create-agent.ts
import createAgent from "@/tools/agent/create-agent.mcpx";
import { dispatch } from "../server/server";
import * as vscode from "vscode";

// create an agent that prompts the user for their name, then generates a react profile page for them

export async function activateCreateAgent(context: vscode.ExtensionContext) {
  const createAgentDisposable = vscode.commands.registerCommand("vs-mcp.createAgent", async (fileUri: vscode.Uri) => {
    const res = await createAgent({
      filepath: fileUri.fsPath
    });
  });

  context.subscriptions.push(createAgentDisposable);
}
