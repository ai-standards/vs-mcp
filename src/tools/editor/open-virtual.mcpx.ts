import * as vscode from "vscode";

export type InputContext = {
  content: string;
  language?: string;
};

export type OutputContext = InputContext & {
  ok: boolean;
};

/**
 * @name Open Virtual Document
 * @description Open a read-only virtual document with content and language.
 */
async function openVirtual(context: InputContext): Promise<OutputContext> {
  const { content, language = "markdown" } = context;
  const doc = await vscode.workspace.openTextDocument({ content: String(content ?? ""), language });
  await vscode.window.showTextDocument(doc, { preview: true });
  return { ...context, ok: true };
}

export default openVirtual;
