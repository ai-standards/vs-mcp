import * as vscode from "vscode";

export type InputContext = {
  branchName: string;
};

export type OutputContext = {
  success: boolean;
  error?: string;
};

/**
 * @name Create Git Branch
 * @description Create a new branch in the current repository using VS Code's Git extension.
 */
export async function createGitBranch(context: InputContext): Promise<OutputContext> {
  try {
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
    const api = gitExtension?.getAPI(1);
    const repo = api?.repositories[0];
    if (!repo) throw new Error("No git repository found.");
    await repo.createBranch(context.branchName, true);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
