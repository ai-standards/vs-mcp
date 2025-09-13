import * as vscode from "vscode";

export type OutputContext = {
  folders: string[];
};

/**
 * @name List Workspace Folders
 * @description List all workspace folders.
 */
export async function listWorkspaceFolders(): Promise<OutputContext> {
  const folders = vscode.workspace.workspaceFolders?.map(f => f.uri.fsPath) ?? [];
  return { folders };
}
