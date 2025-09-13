import * as vscode from "vscode";
import * as path from "node:path";

export type InputContext = {
  dir: string;
  workspaceRoot: string;
};

export type OutputContext = InputContext & {
  items: { name: string; type: string }[];
};

/**
 * @name Read Directory
 * @description List directory entries (name + kind).
 */
export async function readDir(context: InputContext): Promise<OutputContext> {
  const abs = path.isAbsolute(context.dir) ? context.dir : path.join(context.workspaceRoot, context.dir);
  const items = await vscode.workspace.fs.readDirectory(vscode.Uri.file(abs));
  return { ...context, items: items.map(([name, t]) => ({ name, type: t === vscode.FileType.Directory ? "dir" : "file" })) };
}
