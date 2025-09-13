import * as vscode from "vscode";
import * as path from "node:path";

export type InputContext = {
  oldPath: string;
  newPath: string;
};

export type OutputContext = {
  success: boolean;
  error?: string;
};

/**
 * @name Rename Workspace Folder
 * @description Rename a folder in the workspace using VS Code's file system API (preserves user security permissions).
 */
export async function renameWorkspaceFolder(context: InputContext): Promise<OutputContext> {
  try {
    const oldUri = vscode.Uri.file(path.resolve(context.oldPath));
    const newUri = vscode.Uri.file(path.resolve(context.newPath));
    await vscode.workspace.fs.rename(oldUri, newUri, { overwrite: false });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
