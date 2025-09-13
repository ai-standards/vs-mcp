import * as vscode from "vscode";

export type OutputContext = {
  success: boolean;
  error?: string;
};

/**
 * @name Push Changes
 * @description Push committed changes to the remote repository (supports any VCS provider).
 */
export async function pushChanges(): Promise<OutputContext> {
  try {
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
    const api = gitExtension?.getAPI(1);
    const repo = api?.repositories[0];
    if (!repo) throw new Error("No repository found.");
    await repo.push();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}
