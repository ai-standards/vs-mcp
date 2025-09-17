// src/webviews/webview.ts
import * as vscode from "vscode";
import { dispatch } from "../server/server";

/** Register a webview for a contributed view id and a UI source folder.
 *  - viewId: MUST match contributes.views[].id in package.json (e.g. "vsMcpGenerateView")
 *  - viewSrc: path under src/ui (e.g. "ui/generate") that builds to media/ui/generate/main.js
 */
export function registerWebview(
  ctx: vscode.ExtensionContext,
  viewId: string,
  viewSrc: string
): vscode.Disposable {
  const provider = new VsMcpWebviewProvider(viewId, viewSrc, ctx);
  return vscode.window.registerWebviewViewProvider(viewId, provider);
}

/** Shape of messages we expect from the webview */
type IncomingMessage =
  | { type: "ping" }
  | {
      mcp: {
        mcpId: string;
        requestId?: string | number;
        payload?: unknown;
      };
    };

/** Shape of messages we post back to the webview */
type OutgoingMessage =
  | { type: "pong"; text: string }
  | {
      mcp: {
        mcpId: string;
        requestId?: string | number;
        props?: unknown;
        result?: unknown;
        error?: string;
      };
    };

class VsMcpWebviewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(
    private readonly viewId: string,           // e.g. "vsMcpGenerateView"
    private readonly viewSrc: string,          // e.g. "ui/generate"
    private readonly context: vscode.ExtensionContext
  ) {}

  async resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    // Allow loading files from media/** (where our webview bundles live)
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, "media"),
      ],
    };

    // HTML shell (js-only; no CSS assumed)
    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

    // Message bridge: webview -> extension
    webviewView.webview.onDidReceiveMessage(async (message: IncomingMessage) => {
      // Ping/pong (handy for quick smoke tests)
      if ((message as any)?.type === "ping") {
        this.post({ type: "pong", text: "Hello from extension!" });
        return;
      }

      // MCP calls
      const m = (message as any)?.mcp;
      if (m && typeof m.mcpId === "string") {
        const { mcpId, payload, requestId } = m as {
          mcpId: string;
          payload?: unknown;
          requestId?: string | number;
        };

        try {
          const result = await dispatch(mcpId, payload);
          this.post({
            mcp: { mcpId, requestId, props: payload, result },
          });
        } catch (err) {
          console.error(err);
          this.post({
            mcp: {
              mcpId,
              requestId,
              props: payload,
              error: err instanceof Error ? err.message : String(err),
            },
          });
        }
      }
    });
  }

  /** Safely post a message back to the webview, if it exists */
  private post(msg: OutgoingMessage) {
    this._view?.webview.postMessage(msg);
  }

  /** Build HTML wrapper and point to media/ui/<viewName>/main.js */
  private getHtmlForWebview(webview: vscode.Webview): string {
    const viewName = this.viewSrc.split("/").at(-1)!; // e.g. "generate"

    // main.js (stable filename from your Vite config)
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this.context.extensionUri,
        "media",
        "ui",
        viewName,
        "main.js"
      )
    );

    // CSP (tighten as needed)
    const csp = [
      "default-src 'none'",
      `img-src ${webview.cspSource} data: blob:`,
      `script-src ${webview.cspSource}`,
      `style-src ${webview.cspSource} 'unsafe-inline'`,
      `font-src ${webview.cspSource}`,
      `connect-src ${webview.cspSource} https: http:`,
    ].join("; ");

    return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${this.viewId}</title>
  <style>
    html, body, #root { height: 100%; margin: 0; padding: 0; }
    body {
      display: flex; flex-direction: column;
      color: var(--vscode-foreground);
      background: var(--vscode-editor-background);
      font-family: var(--vscode-font-family, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif);
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="${scriptUri}"></script>
</body>
</html>`;
  }
}
