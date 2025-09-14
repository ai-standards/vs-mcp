// getAgentContext: provides context for agent creation, adapted from tools-server-files/context.ts


import { AllTools } from "@/server/types";

function renderToolsMarkdown(): string {
  if (!AllTools?.length) return "_No MCP tools found._\n";
  return [
    "## MCP Tool Reference",
    "",
    "Agents must use these tools to interact with the IDE and workspace. Each tool is strictly typed and should be called with the correct input schema.",
    "",
    ...AllTools.map((t) => {
      return [
        `### \`${t.namespace}.${t.id}\``,
        t.name ? `**${t.name}**` : "",
        t.description ? `${t.description}` : "",
        `**Path:** ${t.path}`,
        "",
        "**Input schema:** Provide all required fields as described above.",
        "**Response:** Returns the result object described above.",
        ""
      ].filter(Boolean).join("\n");
    })
  ].join("\n\n");
}

async function getExample(): Promise<string> {
  return `\nexport const metadata = {\n  id: 'hello',\n  name: 'Hello World',\n  description: 'Greets the current user'\n}\n\nexport const run = async({ mcp, scope }) => {\n  await mcp.dispatch('status.bar', {\n    message: 'Creating greeting',\n    id: 'create',\n    spinner: true\n  })\n  \n  try {\n    const message = await mcp.dispatch('ai.generateText', {\n      prompt: 'Create a short, friendly greeting for this vs-mcp extension user'\n    })\n\n    await mcp.dispatch('status.dismiss', {\n      id: 'create'\n    })\n\n    await mcp.dispatch("ui.info", {\n      message: message.text\n    });\n\n  } catch (err) {\n    // Best-effort friendly error surface\n    const msg = err && typeof err === "object" && "message" in err ? err.message : String(err);\n    try {\n      await mcp.dispatch("ui.error", { message: "An error occurred" });\n    } catch {\n      // swallow to avoid unhandled rejections in extension host\n      // (ui.error might not be available if the MCP server failed to init)\n    }\n  }\n}\n  `;
}

export async function getAgentContext(target?: string): Promise<string> {
  // const toolsApi = await getMcpApi();
  // const tools: McpTool[] = toolsApi.map(t => ({
  //   name: t.name,
  //   description: t.description,
  //   schema: t.schema,
  //   response: t.response,
  //   call: () => { throw new Error("Not implemented"); }
  // }));
  const example = await getExample();
  const toolsMd = renderToolsMarkdown();
  console.log(toolsMd);
  const exampleMd = example ? `\n## Complete Example\n\n\`\`\`ts\n${example}\n\`\`\`\n` : "";

  const agentMd = [
    'This repository uses **VS-MCP tools**. Any file that ends in \'agent.js\' is a VS-MCP agent.',
    '',
    'When you create or update a VS-MVC agent you must use these tools exclusively if at all possible.',
    '',
    'Here are a few key points about writing these agents:',
    '',
    '- the functions are injected with {mcp, scope}. mcp is our mcp server and scope is the path the person clicked to run this',
    '- always communicate with the users using the status and ui mcps',
    '- always confirm before writing or editing a file',
    '- include detailed comments explaining what you are doing and why',
    '- always use default ai settings, dont set the model or temperature',
    '- set a reasonable amount of max tokens so the content never gets cut off, at least 250'
  ].join('\n');

  // Other — simple root file
  const otherMd = [
    '# Project Context',
    '',
    agentMd,
    '',
    'This repository includes an MCP tool surface. Use these tools when generating code.',
    '',
    '## MCP Tools',
    toolsMd,
    exampleMd
  ].join('\n');

  return otherMd;
}
import * as vscode from 'vscode';
import { dispatch } from '@/server/server';

  export interface McpAgent {
    metadata: {
        id: string;
        name: string;
        description?: string;
        path?: string;
    }
    run: (payload: any) => Promise<unknown>
  }

  /**
   * List all agent files in the current project (e.g., *.agent.js)
   * Returns an array of file paths.
   */
/**
 * Dynamically import each agent file, type as McpAgent, and return metadata with path.
 */
export async function listAgents(): Promise<Array<McpAgent['metadata']>> {
  const files = await vscode.workspace.findFiles('**/*.agent.js');
  const agents: Array<McpAgent['metadata']> = [];
  for (const file of files) {
    try {
      const modUrl = file.with({ scheme: 'file' }).toString();
      const imported = await import(/* @vite-ignore */ modUrl);
      const {metadata} = imported;
      if (metadata) {
        agents.push({ ...metadata, path: file.fsPath });
      }
    } catch (err) {
      console.warn(`Failed to import agent: ${file.fsPath}`, err);
    }
  }
  return agents;
}

/**
 * Run an agent by path, mock validate permission, import, and call run(payload).
 */
export async function runAgent(agentPath: string, scope?: string): Promise<unknown> {
  // Import the agent module using a correct file URL
  const { metadata, run } = await import(/* @vite-ignore */ agentPath);

  // todo validate metadata and run function

  // Mock permission validation
  const hasPermission = true; // Replace with real permission logic if needed
  if (!hasPermission) {
    throw new Error('Permission denied to run agent');
  }

  if (!run || typeof run !== 'function') {
    throw new Error('Agent module does not export a valid run function');
  }

  // Run the agent
  return await run({
    scope,
    mcp: {
      dispatch
    }
  });
}

/**
 * Show a VSCode quick pick list of agents and return the selected agent's metadata or void if cancelled.
 */
export async function selectAgent(): Promise<McpAgent['metadata'] | void> {
  const agents = await listAgents();
  if (!agents.length) {
    vscode.window.showWarningMessage('No agents found in this project.');
    return;
  }
  const items = agents.map(agent => ({
    label: agent.name,
    description: agent.description,
    detail: agent.path,
    agent
  }));
  const selection = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select an agent to run',
    matchOnDescription: true,
    matchOnDetail: true
  });
  return selection?.agent;
}


// ---------- Helpers ----------
export function isAgentFile(relPath: string) {
  return relPath.endsWith(".agent.js") || relPath.endsWith(".agent.mjs") || relPath.endsWith(".agent.ts");
}