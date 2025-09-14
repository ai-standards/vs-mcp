import * as vscode from "vscode";

export type InputContext = {
  message: string;
  actions?: string[];
};

export type OutputContext = {
  choice: string | null;
};

/**
 * @namespace ui
 * @name Show Warning Message
 * @description Show warning message with optional actions.
 */
async function showWarningMessage(context: InputContext): Promise<OutputContext> {
  const { message, actions } = context;
  const choice = await vscode.window.showWarningMessage(String(message ?? ""), ...(actions ?? []));
  return { choice: choice ?? null };
}

export default showWarningMessage;
