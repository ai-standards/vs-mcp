import * as vscode from "vscode";

export type InputContext = {
  id: string;
  message: string;
};

export type OutputContext = InputContext & {
  shown: boolean;
};

/**
 * @name Show Status Window
 * @description Show a status message in a window notification.
 */
export async function showStatusWindow(context: InputContext): Promise<OutputContext> {
  const { id, message } = context;
  if (!id || typeof id !== "string") throw new Error("id:string required");
  if (!message || typeof message !== "string") throw new Error("message:string required");
  const notification = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10000);
  notification.text = message;
  notification.show();
  setTimeout(() => notification.dispose(), 3000);
  return { ...context, shown: true };
}
