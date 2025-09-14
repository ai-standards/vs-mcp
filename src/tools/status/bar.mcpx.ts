import * as vscode from "vscode";

export type InputContext = {
  id: string;
  message: string;
  spinner?: boolean;
};

export type OutputContext = InputContext & {
  shown: boolean;
  spinner: boolean;
};

/**
 * @name Show Status Bar
 * @description Show a status message in the status bar. Optionally show a spinner.
 */
async function showStatusBar(context: InputContext): Promise<OutputContext> {
  const { id, message, spinner } = context;
  if (!id || typeof id !== "string") throw new Error("id:string required");
  if (!message || typeof message !== "string") throw new Error("message:string required");
  if (spinner) {
    await vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: message, cancellable: false }, () => Promise.resolve());
    return { ...context, shown: true, spinner: true };
  } else {
    vscode.window.setStatusBarMessage(message);
    return { ...context, shown: true, spinner: false };
  }
}

export default showStatusBar;
