// src/extension.ts
import OpenAI from "openai";
import * as vscode from "vscode";

// MCP types + compose + domain servers (from your ./lib/mcp)
import { McpSession } from "./lib/mcp/types";            // or use the one from earlier
import { composeServers } from "./lib/mcp/compose";
import { McpClient } from "./lib/mcp/client";
import { createAiServer } from "./lib/mcp/servers/ai-server";
import { createEditorServer } from "./lib/mcp/servers/editor-server";
import { createFsServer } from "./lib/mcp/servers/fs-server";
import { createUiServer } from "./lib/mcp/servers/ui-server";
import { isAgentFile, McpAgentPayload, runAgent } from "./lib/agent";
import { ensureOpenAIKey, createAIFacade } from "./lib/providers/openai";
import { validateWorkspace } from "./lib/workspace";



// ---------- Extension entry ----------
export async function activate(context: vscode.ExtensionContext) {
  const runAgentDisposable = vscode.commands.registerCommand("vs-mcp.runAgent", async (fileUri: vscode.Uri) => {
    const rel = vscode.workspace.asRelativePath(fileUri.fsPath, false);
    const payload: Partial<McpAgentPayload> = {scope: rel};
    let agentPath = fileUri.fsPath;
    if (!isAgentFile(rel)) {
      // If not an agent file, prompt to select one
      const selected = await import("./lib/agent").then(mod => mod.selectAgent());
      if (!selected || !selected.path) {
        vscode.window.showInformationMessage("Agent selection cancelled.");
        return;
      }
      agentPath = selected.path;
    }
    try {
      const validPath = validateWorkspace(agentPath); 
      if (! validPath) {
        return;
      }

      const {abs, rel, ws} = validPath;

      // Check if user has previously trusted running agents
      const trustKey = `trustedAgent:${abs}`;
      let trusted = context.globalState.get<boolean>(trustKey);
      if (!trusted) {
        const confirm = await vscode.window.showWarningMessage(
          `Run agent:\n${rel}\n\nYou are about to execute code from this file in the VS Code extension host.\n\nOnly run agents you trust. You can choose to trust this agent and not be asked again.`,
          { modal: true },
          "Run",
          "Run and don't ask again"
        );
        if (confirm === "Run and don't ask again") {
          await context.globalState.update(trustKey, true);
        } else if (confirm !== "Run") {
          return;
        }
      }

      // --- OpenAI key + client
      const apiKey = await ensureOpenAIKey(context, "openai-api-key3");
      const openai = new OpenAI({ apiKey });

      // --- Build MCP servers (from ./lib/mcp/*-server.ts)
      const server = composeServers(
        createAiServer(),
        createEditorServer(),
        createFsServer(),
        createUiServer()
      );

      // --- Session DI + scopes
      const session: McpSession = {
        scopes: ["ai.generate", "editor.apply", "fs.write"], // grant least privilege
        tags: { source: "vscode-extension" },
        now: () => Date.now(),
        di: {
          ai: createAIFacade(openai),   // secrets stay inside facade
          workspaceRoot: ws,
        },
      };

      payload.mcp = new McpClient(server, session);
      await runAgent(abs, payload as McpAgentPayload);
    } catch (err: any) {
      console.error("vs-mcp.runAgent error:", err);
      vscode.window.showErrorMessage(err?.message ?? String(err));
    }
  });

  context.subscriptions.push(runAgentDisposable);
}

export function deactivate() {
  console.log("AI Extension deactivated");
}
