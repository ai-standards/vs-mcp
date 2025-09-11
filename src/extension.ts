// src/extension.ts
import OpenAI from "openai";
import * as path from "path";
import { pathToFileURL } from "url";
import * as vscode from "vscode";

// MCP types + compose + domain servers (from your ./lib/mcp)
import { McpSession, Json } from "./lib/mcp/types";            // or use the one from earlier
import { composeServers } from "./lib/mcp/compose";
import { McpClient } from "./lib/mcp/client";
import { createAiServer } from "./lib/mcp/servers/ai-server";
import { createEditorServer } from "./lib/mcp/servers/editor-server";
import { createFsServer } from "./lib/mcp/servers/fs-server";
import { createUiServer } from "./lib/mcp/servers/ui-server";
// ---------- Helpers ----------
function isAgentFile(relPath: string) {
  return relPath.endsWith(".agent.js") || relPath.endsWith(".agent.mjs") || relPath.endsWith(".agent.ts");
}

function withinWorkspace(abs: string, root: string) {
  const R = path.resolve(root) + path.sep;
  const P = path.resolve(abs);
  return P === path.resolve(root) || P.startsWith(R);
}

async function ensureOpenAIKey(ctx: vscode.ExtensionContext, secretId = "openai-api-key3") {
  let key = await ctx.secrets.get(secretId);
  if (!key) {
    const input = await vscode.window.showInputBox({
      prompt: "Enter your OpenAI API Key",
      ignoreFocusOut: true,
      password: true,
    });
    if (!input) throw new Error("OpenAI API Key is required.");
    await ctx.secrets.store(secretId, input.trim());
    key = input.trim();
  }
  return key!;
}

// Safe text-first AI facade (no raw client/key passed to agents)
function createAIFacade(openai: OpenAI) {
  return {
    async generateText(input: string, opts?: { maxTokens?: number; model?: string; temperature?: number }) {
      const resp = await openai.responses.create({
        model: opts?.model ?? "gpt-5-mini",
        input,
        tool_choice: "none",
        // Remove reasoning.effort or set to a valid value if required by API
        max_output_tokens: Math.min(opts?.maxTokens ?? 600, 1200),
        ...(typeof opts?.temperature === "number" ? { temperature: opts.temperature } : {}),
      });

      const text =
        (resp as any).output_text?.trim() ||
        (resp.output ?? [])
          .flatMap((o: any) => (o.content ?? []).filter((c: any) => c.type === "output_text").map((c: any) => c.text))
          .join("");

      if (!text) throw new Error("Empty model output");
      return text;
    },
    async generateImages(prompt: string, opts?: { count?: number; size?: string; model?: string }) {
      // Uses OpenAI's images.generate endpoint
      // Only allow valid sizes per OpenAI API
      const allowedSizes = ["auto", "512x512", "1024x1024", "1536x1024", "1024x1536", "256x256", "1792x1024", "1024x1792"] as const;
      type OpenAISize = typeof allowedSizes[number];
      const requestedSize = opts?.size ?? "512x512";
      const size: OpenAISize = allowedSizes.includes(requestedSize as OpenAISize)
        ? (requestedSize as OpenAISize)
        : "512x512";
      const resp = await openai.images.generate({
        prompt,
        n: opts?.count ?? 1,
        size,
        model: opts?.model ?? "dall-e-3",
      });
      // Return array of image URLs
      return (resp.data ?? []).map((img: any) => img.url);
    },
  } as const;
}

// ---------- Extension entry ----------
export async function activate(context: vscode.ExtensionContext) {
  const runAgentDisposable = vscode.commands.registerCommand("vs-mcp.runAgent", async (fileUri: vscode.Uri) => {
    try {
      if (!vscode.workspace.isTrusted) {
        vscode.window.showWarningMessage("Trust this workspace to run agents.");
        return;
      }
      if (!fileUri || !fileUri.fsPath) {
        vscode.window.showErrorMessage("No file selected.");
        return;
      }

      const ws = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? "";
      if (!ws) {
        vscode.window.showErrorMessage("Open a folder/workspace to run agents.");
        return;
      }

      const rel = vscode.workspace.asRelativePath(fileUri.fsPath, false);
      if (!isAgentFile(rel)) {
        vscode.window.showErrorMessage("Only *.agent.{ts,js,mjs} files can be run as agents.");
        return;
      }

      const abs = path.resolve(fileUri.fsPath);
      if (!withinWorkspace(abs, ws)) {
        vscode.window.showErrorMessage("Agent file must be within the current workspace.");
        return;
      }

      const confirm = await vscode.window.showWarningMessage(
        `Run agent:\n${rel}\n\nThis executes code in the extension host.`,
        { modal: true },
        "Run"
      );
      if (confirm !== "Run") return;

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

      const mcp = new McpClient(server, session);

      // --- Import agent module safely (cache-bust URL for dev)
      const modUrl = pathToFileURL(abs).toString() + `?t=${Date.now()}`;
      const importedModule = await import(modUrl);
      if (!importedModule?.default || typeof importedModule.default !== "function") {
        throw new Error("No default export function found in the agent module.");
      }

      // --- Run the agent with ONLY the MCP client
      await importedModule.default({ mcp });

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
