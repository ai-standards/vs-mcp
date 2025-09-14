import * as vscode from "vscode";

export type InputContext = {
  repository: string;
  title: string;
  body?: string;
  base?: string;
  head?: string;
};

export type OutputContext = {
  prUrl: string | null;
};

/**
 * @namespace github
 * @name Create GitHub Pull Request
 * @description Create a new pull request in a GitHub repository using VS Code's GitHub integration.
 */
async function createGitHubPullRequest(context: InputContext): Promise<OutputContext> {
  // This is a stub. Actual implementation would use VS Code's GitHub extension API or REST API.
  // For demo, just return a formatted URL.
  const { repository, title, base, head } = context;
  let url = `https://github.com/${repository}/compare/${base ?? "main"}...${head ?? "feature"}?expand=1&title=${encodeURIComponent(title)}`;
  return { prUrl: url };
}

export default createGitHubPullRequest;
