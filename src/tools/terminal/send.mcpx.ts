import * as vscode from "vscode";

export type InputContext = {
  terminalId: string;
  text: string;
};

export type OutputContext = {
  success: boolean;
};

/**
 * @namespace terminal
 * @name Send Text to Terminal
 * @description Send text or command to a specific integrated terminal.
 */
export async function sendTextToTerminal(context: InputContext): Promise<OutputContext> {
  const terminal = vscode.window.terminals.find(t => t.name === context.terminalId);
  if (!terminal) return { success: false };
  terminal.sendText(context.text);
  return { success: true };
}
