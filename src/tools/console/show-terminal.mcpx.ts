import * as vscode from "vscode";

export type InputContext = {
  terminalId: string;
};

export type OutputContext = {
  success: boolean;
};

/**
 * @name Show Terminal
 * @description Show a specific integrated terminal in VS Code.
 */
export async function showTerminal(context: InputContext): Promise<OutputContext> {
  const terminal = vscode.window.terminals.find(t => t.name === context.terminalId);
  if (!terminal) return { success: false };
  terminal.show();
  return { success: true };
}
