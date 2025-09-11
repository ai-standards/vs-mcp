import * as vscode from "vscode";
import * as path from "path";
import { isAgentFile } from "./agent";

export function withinWorkspace(abs: string, root: string) {
    const R = path.resolve(root) + path.sep;
    const P = path.resolve(abs);
    return P === path.resolve(root) || P.startsWith(R);
}

export function validateWorkspace(filepath: string) {
    if (!vscode.workspace.isTrusted) {
        vscode.window.showWarningMessage("Trust this workspace to run agents.");
        return;
    }
    if (!filepath) {
        vscode.window.showErrorMessage("No file selected.");
        return;
    }

    const ws = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? "";
    if (!ws) {
        vscode.window.showErrorMessage("Open a folder/workspace to run agents.");
        return;
    }

    const rel = vscode.workspace.asRelativePath(filepath, false);
    if (!isAgentFile(rel)) {
        vscode.window.showErrorMessage("Only *.agent.{ts,js,mjs} files can be run as agents.");
        return;
    }

    const abs = path.resolve(filepath);
    if (!withinWorkspace(abs, ws)) {
        vscode.window.showErrorMessage("Agent file must be within the current workspace.");
        return;
    }

    return {abs, rel, ws};
}