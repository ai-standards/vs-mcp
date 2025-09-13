import * as vscode from "vscode";

export type InputContext = {
  message: string;
  actions?: string[];
};

export type OutputContext = {
  choice: string | null;
};

/**
 * @name Show Info Message
 * @description Show info message with optional actions.
 */
export async function showInfoMessage(context: InputContext): Promise<OutputContext> {
  const { message, actions } = context;
  const choice = await vscode.window.showInformationMessage(String(message ?? ""), ...(actions ?? []));
  return { choice: choice ?? null };
}
