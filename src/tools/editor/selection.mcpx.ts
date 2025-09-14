import * as vscode from "vscode";

export type OutputContext = {
  path: string;
  start: number;
  end: number;
  text: string;
};

/**
 * @name Editor Selection
 * @description Get selection offsets and text for the active editor.
 */
async function editorSelection(): Promise<OutputContext | null> {
  const ed = vscode.window.activeTextEditor;
  if (!ed) return null;
  const { document, selection } = ed;
  return {
    path: document.uri.fsPath,
    start: document.offsetAt(selection.start),
    end: document.offsetAt(selection.end),
    text: document.getText(selection),
  };
}

export default editorSelection;
