import * as vscode from "vscode";

export type InputContext = {
  message: string;
};

export type OutputContext = {
  success: boolean;
  error?: string;
};

/**
 * @namespace vcs
 * @name Commit Changes
 * @description Commit staged changes in the current repository with a message (supports any VCS provider).
 */
async function commitChanges(context: InputContext): Promise<OutputContext> {
  try {
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
    const api = gitExtension?.getAPI(1);
    const repo = api?.repositories[0];
    if (!repo) throw new Error("No repository found.");
    await repo.commit(context.message);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export default commitChanges;
