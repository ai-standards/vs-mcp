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
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, "media")
      ]
    };

    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

    // Listen for messages from the webview
    webviewView.webview.onDidReceiveMessage(async (message: any) => {
      if (message.type === "ping") {
        webviewView.webview.postMessage({
          type: "pong",
          text: "Hello from extension!"
        });
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
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "media",
        "webview",
        "main.js"
      )
    );

    // Resolve Codicons CSS
    const codiconsUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "node_modules",
        "@vscode/codicons",
        "dist",
        "codicon.css"
      )
    );

    return /* html */ `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>VS-MCP Webview</title>
        <link href="${codiconsUri}" rel="stylesheet" />
        <style>
          body {
            font-family: var(--vscode-font-family, system-ui, sans-serif);
            color: var(--vscode-foreground);
            background: var(--vscode-editor-background);
            padding: 1rem;
          }
          .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 4px 8px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 4px;
          }
          .btn:hover {
            background: var(--vscode-button-hoverBackground);
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="${scriptUri}"></script>
      </body>
      </html>
    `;
  }
}
