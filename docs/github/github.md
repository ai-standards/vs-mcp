# GitHub namespace

The github namespace in the vs-mcp extension connects your MCP workflows to GitHub through VS Code’s GitHub integration. It lets you create issues, open pull requests, and jump to repositories directly from scripts, commands, or interactive UI prompts—no context switching to the browser required.

Use these tools to automate common GitHub tasks, wire them into editor-centric workflows, or add quick actions to your own commands. They rely on the GitHub Pull Requests and Issues extension for VS Code, so your authentication, repository access, and permissions are respected automatically.

Typical ways to use this namespace:
- Capture bugs or feature requests programmatically as you work.
- Push a branch and open a PR with a single call.
- Quickly open a repository in the browser by slug or from your workspace context.

Prerequisite: Install and sign in to the GitHub Pull Requests and Issues extension for VS Code.

## [Create Issue](docs/github/github.createGitHubIssue.md)

Create a new GitHub issue without leaving VS Code. Provide a repository slug and title, optionally include a Markdown body. Returns the created issue URL when available.

Example (basic usage):

```javascript
// Assumptions in all examples:
// - mcp is your MCP client instance
// - server is your MCP server instance (unused here but available)
// - scope is an optional filepath you may use for context

async function run() {
  const { issueUrl } = await mcp.dispatch('github.createGitHubIssue', {
    repository: 'octocat/hello-world',
    title: 'Fix crash when opening large files'
  });

  await mcp.dispatch('ui.showInfoMessage', {
    message: issueUrl ? `Issue created: ${issueUrl}` : 'Issue created in GitHub.'
  });
}

run().catch(console.error);
```

## [Create Pull Request](docs/github/github.createGitHubPullRequest.md)

Open a pull request in a GitHub repository via VS Code’s GitHub integration. Supply a title (and optional body); optionally set base/head branches or rely on sensible defaults.

Example (basic usage):

```javascript
// Assumes: const mcp = ..., const server = ..., const scope = ...;

const { prUrl } = await mcp.dispatch('github.createGitHubPullRequest', {
  repository: 'owner/repo',
  title: 'Fix: correct pagination on results page'
});

// prUrl may be provided; don’t rely on it being non-empty.
if (prUrl) {
  console.log('Created PR:', prUrl);
}
```

## [Open GitHub Repository](docs/github/github.openGitHubRepository.md)

Open a GitHub repository in your browser by providing an owner/repo slug. Returns the URL that was opened.

Example (basic usage):

```javascript
// given: mcp (client), server (MCP server), scope (optional file path)
const { repoUrl } = await mcp.dispatch('github.openGitHubRepository', {
  repository: 'microsoft/vscode'
});

console.log('Opened:', repoUrl);
```