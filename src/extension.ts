import * as vscode from "vscode";
// import { activateRunAgent } from "./commands/run-agent";
// import { activateCreateAgent } from "./commands/create-agent";
import { registerOpenMcpSettings } from "./commands/open-mcp-settings";
// import { registerCreateIdeContext } from "./commands/create-ide-context";
import { VsMcpWebviewProvider } from "./ui/VsMcpWebviewProvider";
import { loadClient } from "./lib/ai";

// ---------- Extension entry ----------
export async function activate(context: vscode.ExtensionContext) {
  // start by loading the ai client, everything needs that
  await loadClient(context);

  // activateRunAgent(context);
  // activateCreateAgent(context);
  registerOpenMcpSettings(context);
  // registerCreateIdeContext(context);

  // Register VS-MCP Webview Provider
  const webviewProvider = new VsMcpWebviewProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      VsMcpWebviewProvider.viewType,
      webviewProvider
    )
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vs-mcp.showWebview", () => {
      vscode.commands.executeCommand("workbench.view.extension.vs-mcp.webview");
    })
  );
// ...existing code...
}

export function deactivate() {
  console.log("AI Extension deactivated");
}
