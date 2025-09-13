import * as vscode from "vscode";

export type InputContext = {
  repository: string;
};

export type OutputContext = {
  repoUrl: string;
};

/**
 * @name Open GitHub Repository
 * @description Open a GitHub repository in the browser using VS Code's GitHub integration.
 */
export async function openGitHubRepository(context: InputContext): Promise<OutputContext> {
  const { repository } = context;
  const url = `https://github.com/${repository}`;
  await vscode.env.openExternal(vscode.Uri.parse(url));
  return { repoUrl: url };
}
