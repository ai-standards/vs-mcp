import * as vscode from "vscode";

export type InputContext = {
  terminalId: string;
};

export type OutputContext = {
  success: boolean;
};

/**
 * @namespace terminal
 * @name Close Terminal
 * @description Close a specific integrated terminal in VS Code.
 */
export async function closeTerminal(context: InputContext): Promise<OutputContext> {
  const terminal = vscode.window.terminals.find(t => t.name === context.terminalId);
  if (!terminal) return { success: false };
  terminal.dispose();
  return { success: true };
}
