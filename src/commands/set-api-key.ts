import { setKey } from "@/lib/ai";
import * as vscode from "vscode";

export async function activateSetApiKey(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("vs-mcp.setApiKey", async () => {
    await setKey(context);
    vscode.window.showInformationMessage("API Key saved.");
  });
  context.subscriptions.push(disposable);
}
