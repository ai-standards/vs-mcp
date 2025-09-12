// mcp/servers/fsServer.ts
import * as vscode from "vscode";
import * as path from "node:path";
import { McpServer, McpTool, McpResource, McpSession, Json } from "../types";

function root(session: McpSession): string {
  const r = session.di?.["workspaceRoot"] as string | undefined;
  if (!r) throw new Error("workspaceRoot not set on session.di");
  return path.resolve(r);
}
function toAbs(session: McpSession, p: string) {
  const ws = root(session);
  const abs = path.isAbsolute(p) ? p : path.join(ws, p);
  const norm = path.resolve(abs);
  const allowed = (norm + path.sep).startsWith(ws + path.sep) || norm === ws;
  if (!allowed) throw new Error("Path escapes workspace.");
  return norm;
}

const tools: McpTool[] = [
  {
    name: "fs.readFile",
    description: "Read a UTF-8 file inside the workspace.",
    schema: { path: "string" },
    response: { path: "string", text: "string" },
    async call(args, session) {
      const abs = toAbs(session, String((args as any)?.path ?? ""));
      const buff = await vscode.workspace.fs.readFile(vscode.Uri.file(abs));
      return { path: abs, text: Buffer.from(buff).toString("utf8") };
    },
  },
  {
    name: "fs.writeFile",
    description: "Write a UTF-8 file inside the workspace (with confirm).",
    schema: { path: "string", content: "string" },
    response: { ok: "boolean", path: "string" },
    async call(args, session) {
      if (!session.scopes.includes("fs.write")) throw new Error("Missing scope: fs.write");
      const abs = toAbs(session, String((args as any)?.path ?? ""));
      const content = String((args as any)?.content ?? "");
      const ok = await vscode.window.showWarningMessage(`Write file?\n${abs}`, { modal: true }, "Write");
      if (ok !== "Write") return { ok: false, path: abs };
      await vscode.workspace.fs.createDirectory(vscode.Uri.file(path.dirname(abs)));
      await vscode.workspace.fs.writeFile(vscode.Uri.file(abs), Buffer.from(content, "utf8"));
      return { ok: true, path: abs };
    },
  },
  {
    name: "fs.readDir",
    description: "List directory entries (name + kind).",
    schema: { dir: "string" },
    response: { dir: "string", items: "{ name: string, type: string }[]" },
    async call(args, session) {
      const abs = toAbs(session, String((args as any)?.dir ?? ""));
      const items = await vscode.workspace.fs.readDirectory(vscode.Uri.file(abs));
      return { dir: abs, items: items.map(([name, t]) => ({ name, type: t === vscode.FileType.Directory ? "dir" : "file" })) };
    },
  },
  {
    name: "fs.find",
    description: "Find files by glob (workspace relative).",
    schema: { glob: "string", maxResults: "number?=100" },
    response: { files: "string[]" },
    async call(args, session) {
      const { glob = "**/*", maxResults = 100 } = (args as any) ?? {};
      const files = await vscode.workspace.findFiles(String(glob), undefined, Number(maxResults));
      return { files: files.map(u => u.fsPath) };
    },
  },
];

export function createFsServer(): McpServer {
  return {
    async listTools() { return tools; },
    async listResources() { return [] as McpResource[]; },
  };
}
