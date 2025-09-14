
import { dispatch } from "../server/server";
import * as vscode from "vscode";

export class VsMcpWebviewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "vs-mcp.webview";
  private _view?: vscode.WebviewView;

  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true
    };
    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
    // Listen for messages from the webview
    webviewView.webview.onDidReceiveMessage(async (message: any) => {
      if (message.type === "ping") {
        webviewView.webview.postMessage({ type: "pong", text: "Hello from extension!" });
        return;
      }
      if (message.mcp) {
        const { mcpId, payload, requestId } = message.mcp;
        try {
          const result = await dispatch(mcpId, payload);
          webviewView.webview.postMessage({
            mcp: {
              mcpId,
              requestId,
              props: payload,
              result
            }
          });
        } catch (error) {
          console.error(error);
          webviewView.webview.postMessage({
            mcp: {
              mcpId,
              requestId,
              props: payload,
              error: error instanceof Error ? error.message : String(error)
            }
          });
        }
      }
    });
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
      this.context.extensionUri,
      "media",
      "webview",
      "main.js"
    ));
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>VS-MCP Webview</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="${scriptUri}"></script>
      </body>
      </html>
    `;
  }
}
