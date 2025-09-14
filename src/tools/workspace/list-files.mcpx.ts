import * as vscode from "vscode";

export type InputContext = {
  glob?: string;
};

export type OutputContext = {
  files: string[];
};

/**
 * @namespace workspace
 * @name List Workspace Files
 * @description List files in the workspace matching a glob pattern.
 */
export async function listWorkspaceFiles(context: InputContext): Promise<OutputContext> {
  const { glob = "**/*" } = context;
  const files = await vscode.workspace.findFiles(glob);
  return { files: files.map(f => f.fsPath) };
}
