import * as vscode from "vscode";
import * as path from "node:path";

export type InputContext = {
  path: string;
};

export type OutputContext = {
  success: boolean;
  error?: string;
};

/**
 * @name Delete Workspace File
 * @description Delete a file from the workspace.
 */
export async function deleteWorkspaceFile(context: InputContext): Promise<OutputContext> {
  try {
    const uri = vscode.Uri.file(path.resolve(context.path));
    await vscode.workspace.fs.delete(uri);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
