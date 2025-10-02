// getAgentContext: provides context for agent creation, adapted from tools-server-files/context.ts

import * as vscode from "vscode";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { AllTools } from "@/server/types";
import { dispatch } from "@/server/server";

/* ---------------------------------------
   Markdown helpers for agent authoring
----------------------------------------*/

function renderToolsMarkdown(): string {
  if (!AllTools?.length) return "_No MCP tools found._\n";
  return [
    "## MCP Tool Reference",
    "",
    "Agents must use these tools to interact with the IDE and workspace. Each tool is strictly typed and should be called with the correct input schema. it will return the output schema.",
    "",
    ...AllTools.map((t) => {
      return [
        `### \`${t.namespace}.${t.id}\``,
        t.name ? `**${t.name}**` : "",
        t.description ? `${t.description}` : "",
        `**Path:** ${t.path}`,
        "",
        `**Input schema:** ${JSON.stringify(t.input)}`,
        `**Output schema:**  ${JSON.stringify(t.input)}`,
        "",
      ]
        .filter(Boolean)
        .join("\n");
    }),
  ].join("\n\n");
}

async function getExample(): Promise<string> {
  return `export const metadata = {
  id: 'hello',
  name: 'Hello World',
  description: 'Greets the current user'
}

export const run = async ({ mcp, scope }) => {
  await mcp.dispatch('status.showStatusBar', {
    message: 'Creating greeting',
    id: 'create',
    spinner: true
  })
  
  try {
    const message = await mcp.dispatch('ai.generateText', {
      prompt: 'Create a short, friendly greeting for this vs-mcp extension user'
    })

    await mcp.dispatch('status.dismissStatus', { id: 'create' })

    await mcp.dispatch('ui.showInfoMessage', { message: message.text })
  } catch (err) {
    // Best-effort friendly error surface
    const msg = err && typeof err === "object" && "message" in err ? err.message : String(err)
    try {
      await mcp.dispatch('ui.showWarningMessage', { message: 'An error occurred: ' + msg })
    } catch {
      // swallow to avoid unhandled rejections in extension host
      // (ui.error might not be available if the MCP server failed to init)
    }
  }
}`;
}

export async function getAgentContext(target?: string): Promise<string> {
  const example = await getExample();
  // const toolsMd = renderToolsMarkdown();
  const exampleMd = example
    ? `\n## Complete Example\n\n\`\`\`ts\n${example}\n\`\`\`\n`
    : "";

  const agentMd = [
    "This repository uses **VS-MCP tools**. Any file that ends in `*.agent.js` is a VS-MCP agent.",
    "",
    "When you create or update a VS-MCP agent you should use these tools wherever possible.",
    "",
    "Here are a few key points about writing these agents:",
    "",
    "- The functions are injected with `{ mcp, scope }`. `mcp` is our tool server and `scope` is the path the person clicked to run this.",
    "- Always communicate with the user using the `status.*` and `ui.*` MCPs.",
    "- Always confirm before writing or editing a file.",
    "- Include detailed comments explaining what you are doing and why.",
    "- Use default AI settings; don’t set the model or temperature explicitly.",
    "- Set a reasonable `maxTokens` so content is not cut off (≥ 250).",
  ].join("\n");

  const otherMd = [
    "# Project Context",
    "",
    agentMd,
    "",
    "This repository includes an MCP tool surface. Use these tools when generating code.",
    "",
    "## MCP Tools",
    JSON.stringify(AllTools, null, 2),
    "## Example",
    exampleMd,
  ].join("\n");

  return otherMd;
}

/* ---------------------------------------
   Agent loading & execution (Node/VS Code)
----------------------------------------*/

export interface McpAgent {
  metadata: {
    id: string;
    name: string;
    description?: string;
    path?: string;
  };
  run: (payload: any) => Promise<unknown>;
}

export interface AgentScope {
  filepath?: string;
}

/** Detect agent filename extensions we support. */
export function isAgentFile(relPath: string) {
  return (
    relPath.endsWith(".agent.js") ||
    relPath.endsWith(".agent.mjs") ||
    relPath.endsWith(".agent.ts")
  );
}

/**
 * List all agent files in the current project.
 * Returns metadata with absolute file-system path for convenience.
 * Note: .ts agents require your runtime to transpile/alias at import time; otherwise we skip them.
 */
export async function listAgents(): Promise<Array<McpAgent["metadata"]>> {
  // Glob all potential agent files
  const files = await vscode.workspace.findFiles("**/*.agent.{js,mjs,ts}");
  const agents: Array<McpAgent["metadata"]> = [];

  for (const file of files) {
    const fsPath = file.fsPath;
    const isTs = fsPath.endsWith(".ts");

    try {
      if (isTs) {
        // In the extension host we typically cannot import TS directly.
        // We warn and skip to avoid runtime failures unless user has a TS loader in place.
        console.warn(
          `Skipping TypeScript agent (no TS runtime loader): ${fsPath}`
        );
        continue;
      }

      const url = fileUrlFromFsPath(fsPath);
      // Dynamic ESM import from a file URL.
      const mod: any = await import(/* @vite-ignore */ url);

      const metadata = mod?.metadata;
      if (metadata && typeof metadata === "object" && metadata.id && metadata.name) {
        agents.push({ ...metadata, path: fsPath });
      } else {
        console.warn(`Agent missing valid metadata: ${fsPath}`);
      }
    } catch (err) {
      console.warn(`Failed to import agent: ${fsPath}`, err);
    }
  }

  return agents;
}

/**
 * Run an agent by absolute path (js/mjs). Validates export shape, then calls run({ scope, mcp }).
 * For TS paths, you must supply a transpiled artifact or a TS loader.
 */
export async function callAgent(agentPath: string, scope?: AgentScope): Promise<unknown> {
  const absPath = path.isAbsolute(agentPath)
    ? agentPath
    : path.resolve(agentPath);

  const isTs = /\.ts$/i.test(absPath);
  if (isTs) {
    throw new Error(
      `Cannot run TypeScript agent directly: ${absPath}. Build it to JS or register a TS runtime (e.g., tsx).`
    );
  }

  const url = fileUrlFromFsPath(absPath);

  // Import the agent module via file URL (Node ESM-friendly).
  const mod: any = await import(/* @vite-ignore */ url);

  // Support either named export `run` or default-exported function.
  const run: undefined | ((payload: any) => Promise<unknown>) =
    typeof mod?.run === "function"
      ? mod.run
      : typeof mod?.default === "function"
      ? mod.default
      : undefined;

  if (!run) {
    throw new Error(
      `Agent module does not export a valid run function (export 'run' or default a function): ${absPath}`
    );
  }

  // Optional: validate metadata if you need it
  // const { metadata } = mod;

  // TODO: real permission logic
  const hasPermission = true;
  if (!hasPermission) {
    throw new Error("Permission denied to run agent");
  }

  return await run({
    scope,
    mcp: { dispatch },
  });
}

/**
 * Show a VS Code quick pick list of agents and return the selected agent's metadata or void if cancelled.
 */
export async function selectAgent(): Promise<McpAgent["metadata"] | void> {
  const agents = await listAgents();
  if (!agents.length) {
    vscode.window.showWarningMessage("No agents found in this project.");
    return;
  }

  const items = agents.map((agent) => ({
    label: agent.name,
    description: agent.description,
    detail: agent.path,
    agent,
  }));

  const selection = await vscode.window.showQuickPick(items, {
    placeHolder: "Select an agent to run",
    matchOnDescription: true,
    matchOnDetail: true,
  });

  return selection?.agent;
}

/* ---------------------------------------
   Utilities
----------------------------------------*/

function fileUrlFromFsPath(fsPath: string): string {
  // Normalize Windows paths and ensure proper file:// URL
  const abs = path.resolve(fsPath);
  return pathToFileURL(abs).href;
}
