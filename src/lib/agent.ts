import * as vscode from 'vscode';
import { McpClient } from '../tools/client';

  export interface McpAgentPayload {
    mcp: McpClient;
    scope: string;
  }

  export interface McpAgent {
    metadata: {
        id: string;
        name: string;
        description?: string;
        path?: string;
    }
    run: (payload: McpAgentPayload) => Promise<unknown>
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
export async function runAgent(agentPath: string, payload: McpAgentPayload): Promise<unknown> {
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
  return await run(payload);
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