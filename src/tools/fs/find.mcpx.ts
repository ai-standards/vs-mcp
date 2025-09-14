import * as vscode from "vscode";

export type InputContext = {
  glob?: string;
  maxResults?: number;
};

export type OutputContext = {
  files: string[];
};

/**
 * @namespace fs
 * @name Find Files
 * @description Find files by glob pattern (workspace relative).
 */
async function findFiles(context: InputContext): Promise<OutputContext> {
  const { glob = "**/*", maxResults = 100 } = context;
  const files = await vscode.workspace.findFiles(String(glob), undefined, Number(maxResults));
  return { files: files.map(u => u.fsPath) };
}

export default findFiles;
