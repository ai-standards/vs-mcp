import * as vscode from "vscode";

export type OutputContext = {
  path: string;
  languageId: string;
  text: string;
};

/**
 * @name Active File
 * @description Get the active editor file's path, languageId, and selected or full text.
 */
async function activeFile(): Promise<OutputContext | null> {
  const ed = vscode.window.activeTextEditor;
  if (!ed) return null;
  const { document, selection } = ed;
  const text = selection?.isEmpty ? document.getText() : document.getText(selection);
  return { path: document.uri.fsPath, languageId: document.languageId, text };
}

export default activeFile;
