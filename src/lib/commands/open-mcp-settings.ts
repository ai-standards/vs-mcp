import * as vscode from 'vscode';

export function registerOpenMcpSettings(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('vs-mcp.openMcpSettings', () => {
      vscode.commands.executeCommand('workbench.action.openSettings', 'vs-mcp.apiUrl');
    })
  );
}
