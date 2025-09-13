import * as vscode from "vscode";

export type InputContext = {
  name?: string;
};

export type OutputContext = {
  terminalId: string;
};

/**
 * @name Create Terminal
 * @description Create a new integrated terminal in VS Code.
 */
export async function createTerminal(context: InputContext): Promise<OutputContext> {
  const terminal = vscode.window.createTerminal(context.name ?? "Console");
  terminal.show();
  return { terminalId: terminal.name };
}
