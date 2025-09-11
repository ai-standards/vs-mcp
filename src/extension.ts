import * as vscode from "vscode";
import { activateRunAgent } from "./lib/commands/run-agent";
import { activateCreateAgent } from "./lib/commands/create-agent";

// ---------- Extension entry ----------
export async function activate(context: vscode.ExtensionContext) {
  activateRunAgent(context);
  activateCreateAgent(context);
}

export function deactivate() {
  console.log("AI Extension deactivated");
}
