import * as vscode from "vscode";

export type InputContext = {
  branchName: string;
};

export type OutputContext = {
  success: boolean;
  error?: string;
};

/**
 * @namespace git
 * @name Merge Git Branch
 * @description Merge the specified branch into the current branch using VS Code's Git extension.
 */
async function mergeGitBranch(context: InputContext): Promise<OutputContext> {
  try {
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
    const api = gitExtension?.getAPI(1);
    const repo = api?.repositories[0];
    if (!repo) throw new Error("No git repository found.");
    await repo.merge(context.branchName);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export default mergeGitBranch;
