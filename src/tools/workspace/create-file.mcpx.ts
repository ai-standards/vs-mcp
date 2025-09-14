import * as vscode from "vscode";
import * as path from "node:path";

export type InputContext = {
  path: string;
  content?: string;
};

export type OutputContext = {
  success: boolean;
  error?: string;
};

/**
 * @namespace workspace
 * @name Create Workspace File
 * @description Create a new file in the workspace with optional content.
 */
export async function createWorkspaceFile(context: InputContext): Promise<OutputContext> {
  try {
    const uri = vscode.Uri.file(path.resolve(context.path));
    await vscode.workspace.fs.writeFile(uri, Buffer.from(context.content ?? "", "utf8"));
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
