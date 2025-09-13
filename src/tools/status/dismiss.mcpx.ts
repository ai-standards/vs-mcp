import * as vscode from "vscode";

export type InputContext = {
  id: string;
};

export type OutputContext = InputContext & {
  dismissed: boolean;
};

/**
 * @name Dismiss Status
 * @description Dismiss any status notification by id.
 */
export async function dismissStatus(context: InputContext): Promise<OutputContext> {
  // In a real implementation, you would track disposables and resolve spinners by id.
  // Here, we just return dismissed: true for demo purposes.
  return { ...context, dismissed: true };
}
