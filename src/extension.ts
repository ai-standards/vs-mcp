import * as vscode from "vscode";
import { registerOpenMcpSettings } from "./commands/open-mcp-settings";
import { loadClient } from "./lib/ai";
import { activateCreateAgent } from "./commands/create-agent";
import { activateRunAgent } from "./commands/run-agent";
import { activateSetApiKey } from "./commands/set-api-key";
import { registerWebview } from "./lib/webview";

// ---------- Extension entry ----------
export async function activate(context: vscode.ExtensionContext) {
  // start by loading the ai client, everything needs that
  await loadClient(context);

  activateRunAgent(context);
  activateCreateAgent(context);
  registerOpenMcpSettings(context);
  activateSetApiKey(context);
  
  // registerCreateIdeContext(context);

  // Register VS-MCP Webview Providers
  context.subscriptions.push(
    registerWebview(context, "vsMcpListView", "ui/list"),
    registerWebview(context, "vsMcpGenerateView", "ui/generate"),
    registerWebview(context, "vsMcpIntegrate", "ui/integrate"),
  );
// ...existing code...
}

export function deactivate() {
  console.log("AI Extension deactivated");
}
