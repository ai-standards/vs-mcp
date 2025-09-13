import * as vscode from "vscode";

export type InputContext = {
  repository: string;
  title: string;
  body?: string;
};

export type OutputContext = {
  issueUrl: string | null;
};

/**
 * @name Create GitHub Issue
 * @description Create a new issue in a GitHub repository using VS Code's GitHub integration.
 */
export async function createGitHubIssue(context: InputContext): Promise<OutputContext> {
  // This is a stub. Actual implementation would use VS Code's GitHub extension API or REST API.
  // For demo, just return a formatted URL.
  const { repository, title } = context;
  const url = `https://github.com/${repository}/issues/new?title=${encodeURIComponent(title)}`;
  return { issueUrl: url };
}
