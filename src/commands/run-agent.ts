// src/extension.ts
import OpenAI from "openai";
import * as vscode from "vscode";

// MCP types + compose + domain servers (from your ../mcp)
import { McpSession } from "../../mcp/types";            // or use the one from earlier
import { composeServers } from "../../mcp/compose";
import { McpClient } from "../../mcp/client";
import { createAiServer } from "../../mcp/servers/ai-server";
import { createEditorServer } from "../../mcp/servers/editor-server";
import { createFsServer } from "../../mcp/servers/fs-server";
import { createUiServer } from "../../mcp/servers/ui-server";
import { isAgentFile, McpAgentPayload, runAgent } from "../agent";
import { ensureOpenAIKey, createAIFacade } from "../providers/openai";
import { validateWorkspace } from "../workspace";
import { createStatusServer } from "../../mcp/servers/status-server";

export async function activateRunAgent(context: vscode.ExtensionContext) {
  const runAgentDisposable = vscode.commands.registerCommand("vs-mcp.runAgent", async (fileUri: vscode.Uri) => {
    const rel = vscode.workspace.asRelativePath(fileUri.fsPath, false);
    const payload: Partial<McpAgentPayload> = {scope: rel};
    let agentPath = fileUri.fsPath;
    if (!isAgentFile(rel)) {
      // If not an agent file, prompt to select one
      const selected = await import("../agent").then(mod => mod.selectAgent());
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

      // --- Build MCP servers (from ../mcp/*-server.ts)
      const server = composeServers(
        createAiServer(),
        createEditorServer(),
        createFsServer(),
        createUiServer(),
        createStatusServer()
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