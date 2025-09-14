import * as vscode from "vscode";
import * as path from "node:path";

export type InputContext = {
  path: string;
  content: string;
  workspaceRoot: string;
};

export type OutputContext = InputContext & {
  ok: boolean;
};

/**
 * @namespace fs
 * @name Write File
 * @description Write a UTF-8 file inside the workspace (with confirm).
 */
async function writeFile(context: InputContext): Promise<OutputContext> {
  const abs = path.isAbsolute(context.path) ? context.path : path.join(context.workspaceRoot, context.path);
  const ok = await vscode.window.showWarningMessage(`Write file?\n${abs}`, { modal: true }, "Write");
  if (ok !== "Write") return { ...context, ok: false };
  await vscode.workspace.fs.createDirectory(vscode.Uri.file(path.dirname(abs)));
  await vscode.workspace.fs.writeFile(vscode.Uri.file(abs), Buffer.from(context.content, "utf8"));
  return { ...context, ok: true };
}

export default writeFile;
