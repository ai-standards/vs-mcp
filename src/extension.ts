import * as vscode from "vscode";
import { activateRunAgent } from "./lib/commands/run-agent";
import { activateCreateAgent } from "./lib/commands/create-agent";
import { registerOpenMcpSettings } from "./lib/commands/open-mcp-settings";
import { registerCreateIdeContext } from "./lib/commands/create-ide-context";

// ---------- Extension entry ----------
export async function activate(context: vscode.ExtensionContext) {
  activateRunAgent(context);
  activateCreateAgent(context);
  registerOpenMcpSettings(context);
  registerCreateIdeContext(context);
  
    // Register VS-MVC TreeView
    const { VsMvcTreeDataProvider } = await import("./lib/vsMvcTree");
    const vsMvcProvider = new VsMvcTreeDataProvider();
    vscode.window.registerTreeDataProvider("vs-mvc", vsMvcProvider);
    context.subscriptions.push(vscode.commands.registerCommand("vs-mvc.refresh", () => vsMvcProvider.refresh()));
// ...existing code...
}

export function deactivate() {
  console.log("AI Extension deactivated");
}
