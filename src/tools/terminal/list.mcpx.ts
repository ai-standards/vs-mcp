import * as vscode from "vscode";

export type OutputContext = {
  terminals: string[];
};

/**
 * @name List Terminals
 * @description List all open integrated terminals in VS Code.
 */
export async function listTerminals(): Promise<OutputContext> {
  const terminals = vscode.window.terminals.map(t => t.name);
  return { terminals };
}
