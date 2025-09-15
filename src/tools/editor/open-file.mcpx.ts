
import * as vscode from "vscode";

export type InputContext = {
  path: string;
};

export type OutputContext = {
  ok: boolean;
};

/**
 * @namespace editor
 * @name Open File By Path
 * @description Open a file in the editor by absolute path.
 */
export default async function openFile(context: InputContext): Promise<OutputContext> {
  const { path } = context;
  if (!path) throw new Error("Missing file path");
  const uri = vscode.Uri.file(path);
  await vscode.window.showTextDocument(uri, { preview: false });
  return { ok: true };
}
