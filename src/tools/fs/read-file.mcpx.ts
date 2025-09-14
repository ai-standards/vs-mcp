import * as vscode from "vscode";
import * as path from "node:path";

export type InputContext = {
  path: string;
  workspaceRoot: string;
};

export type OutputContext = InputContext & {
  text: string;
};

/**
 * @namespace fs
 * @name Read File
 * @description Read a UTF-8 file inside the workspace.
 */
async function readFile(context: InputContext): Promise<OutputContext> {
  const abs = path.isAbsolute(context.path) ? context.path : path.join(context.workspaceRoot, context.path);
  const buff = await vscode.workspace.fs.readFile(vscode.Uri.file(abs));
  return { ...context, text: Buffer.from(buff).toString("utf8") };
}

export default readFile;
