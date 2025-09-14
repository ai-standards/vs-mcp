import * as vscode from "vscode";
import * as path from "node:path";

export type InputContext = {
  targetPath: string;
  newContent: string;
  title?: string;
  workspaceRoot: string;
};

export type OutputContext = InputContext & {
  applied: boolean;
};

/**
 * @namespace editor
 * @name Propose Edits
 * @description Show a diff and ask the user to apply changes to a file in the workspace.
 */
async function proposeEdits(context: InputContext): Promise<OutputContext> {
  const { targetPath, newContent, title = "Agent: Proposed edits", workspaceRoot } = context;
  const abs = path.isAbsolute(targetPath) ? targetPath : path.join(workspaceRoot, targetPath);
  if (!abs.startsWith(path.resolve(workspaceRoot) + path.sep)) throw new Error("Writes must stay in workspace.");

  const left = vscode.Uri.file(abs);
  const right = vscode.Uri.parse(`untitled:${abs}.agent-preview`);
  const orig = await vscode.workspace.openTextDocument(left);
  await vscode.workspace.openTextDocument({ content: String(newContent ?? ""), language: orig.languageId });
  await vscode.commands.executeCommand("vscode.diff", left, right, title);

  const choice = await vscode.window.showInformationMessage("Apply proposed edits?", { modal: true }, "Apply", "Cancel");
  if (choice !== "Apply") return { ...context, applied: false };

  const edit = new vscode.WorkspaceEdit();
  edit.replace(left, new vscode.Range(0, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER), String(newContent ?? ""));
  const ok = await vscode.workspace.applyEdit(edit);
  return { ...context, applied: ok };
}

export default proposeEdits;
