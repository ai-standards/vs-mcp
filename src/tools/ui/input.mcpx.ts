import * as vscode from "vscode";

export type InputContext = {
  prompt: string;
  placeHolder?: string;
};

export type OutputContext = {
  value: string | null;
};

/**
 * @name Show Input Box
 * @description Prompt user for a string input.
 */
export async function showInputBox(context: InputContext): Promise<OutputContext> {
  const { prompt, placeHolder } = context;
  const value = await vscode.window.showInputBox({ prompt: String(prompt ?? ""), placeHolder: placeHolder ? String(placeHolder) : undefined });
  return { value: value ?? null };
}
