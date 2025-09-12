// mcp/servers/editorServer.ts
import * as vscode from "vscode";
import * as path from "node:path";
import { McpServer, McpTool, McpResource, McpSession, Json } from "../types";

function within(root: string, p: string) {
  const R = path.resolve(root) + path.sep;
  const P = path.resolve(p);
  return P.startsWith(R);
}

function getRoot(session: McpSession): string {
  const root = session.di?.["workspaceRoot"] as string | undefined;
  if (!root) throw new Error("workspaceRoot not set on session.di");
  return root;
}

const tools: McpTool[] = [
  {
    name: "editor.openVirtual",
    description: "Open a read-only virtual document with content.",
    schema: { content: "string", language: "string?='markdown'" },
    response: { ok: "boolean" },
    async call(args) {
      const { content, language = "markdown" } = (args as any) ?? {};
      const doc = await vscode.workspace.openTextDocument({ content: String(content ?? ""), language });
      await vscode.window.showTextDocument(doc, { preview: true });
      return { ok: true };
    },
  },
  {
    name: "editor.proposeEdits",
    description: "Show a diff and ask the user to apply changes.",
    schema: { targetPath: "string", newContent: "string", title: "string?='Agent: Proposed edits'" },
    response: { applied: "boolean" },
    async call(args, session) {
      if (!session.scopes.includes("editor.apply")) throw new Error("Missing scope: editor.apply");
      const root = getRoot(session);
      const { targetPath, newContent, title = "Agent: Proposed edits" } = (args as any) ?? {};
      const abs = path.isAbsolute(targetPath) ? targetPath : path.join(root, targetPath);
      if (!within(root, abs)) throw new Error("Writes must stay in workspace.");

      const left = vscode.Uri.file(abs);
      const right = vscode.Uri.parse(`untitled:${abs}.agent-preview`);
      const orig = await vscode.workspace.openTextDocument(left);
      await vscode.workspace.openTextDocument({ content: String(newContent ?? ""), language: orig.languageId });
      await vscode.commands.executeCommand("vscode.diff", left, right, title);

      const choice = await vscode.window.showInformationMessage("Apply proposed edits?", { modal: true }, "Apply", "Cancel");
      if (choice !== "Apply") return { applied: false };

      const edit = new vscode.WorkspaceEdit();
      edit.replace(left, new vscode.Range(0, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), String(newContent ?? ""));
      const ok = await vscode.workspace.applyEdit(edit);
      return { applied: ok };
    },
  },
];

const resources: McpResource[] = [
  {
    name: "editor.activeFile",
    description: "Active editor file (path, languageId, selection or full text).",
    async read() {
      const ed = vscode.window.activeTextEditor;
      if (!ed) return null;
      const { document, selection } = ed;
      const text = selection?.isEmpty ? document.getText() : document.getText(selection);
      return { path: document.uri.fsPath, languageId: document.languageId, text };
    },
  },
  {
    name: "editor.selection",
    description: "Selection offsets and text for the active editor.",
    async read() {
      const ed = vscode.window.activeTextEditor;
      if (!ed) return null;
      const { document, selection } = ed;
      return {
        path: document.uri.fsPath,
        start: document.offsetAt(selection.start),
        end: document.offsetAt(selection.end),
        text: document.getText(selection),
      };
    },
  },
];

export function createEditorServer(): McpServer {
  return {
    async listTools() { return tools; },
    async listResources() { return resources; },
  };
}
