import * as vscode from "vscode";

export const metadata = {
  id: "autoFormatOnSave",
  name: "Auto Format On Save",
  description: "Automatically formats the active file whenever it is saved."
};

export async function run({ mcp, scope }: { mcp: any; scope: any }) {
  const disposable = vscode.workspace.onDidSaveTextDocument(async (document) => {
    const editor = await vscode.window.showTextDocument(document);
    await vscode.commands.executeCommand("editor.action.formatDocument");
  });

  // Optionally store the disposable for cleanup if needed
  return { disposable };
}
