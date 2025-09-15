import * as vscode from "vscode";

export async function activateSetApiKey(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("vs-mcp.setApiKey", async () => {
    const secretId = "vs-mvc-api-key";
    const input = await vscode.window.showInputBox({
      prompt: "Enter your OpenAI API Key",
      ignoreFocusOut: true,
      password: true,
    });
    if (!input) {
      vscode.window.showWarningMessage("OpenAI API Key is required.");
      return;
    }
    await context.secrets.store(secretId, input.trim());
    vscode.window.showInformationMessage("API Key saved.");
  });
  context.subscriptions.push(disposable);
}
