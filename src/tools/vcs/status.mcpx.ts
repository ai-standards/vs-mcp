import * as vscode from "vscode";

export type OutputContext = {
  status: string;
  error?: string;
};

/**
 * @name VCS Status
 * @description Get the status of the current repository (supports any VCS provider).
 */
export async function getVcsStatus(): Promise<OutputContext> {
  try {
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
    const api = gitExtension?.getAPI(1);
    const repo = api?.repositories[0];
    if (!repo) throw new Error("No repository found.");
    const status = repo.state.HEAD?.name ?? "unknown";
    return { status };
  } catch (err: any) {
    return { status: "error", error: err?.message };
  }
}
