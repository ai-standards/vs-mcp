# Managing GitHub

The GitHub MCPs in the vs-mcp extension provide high-level, editor-native GitHub operations powered by the VS Code GitHub integration. You can create issues, open pull requests, and jump to repositories directly from your coding flow, without switching to the browser.

Use these tools to automate common GitHub tasks in scripts or interactive flows. Prompt users for input, capture bugs or feature requests, and show progress or results using MCP UI/status tools. Pair GitHub tools with git/vcs tools to build end-to-end workflows.

Prerequisites:
- The VS Code GitHub Pull Requests and Issues extension is installed and you are signed in.
- You have access to the target repository.

## [Create GitHub Issue](docs/github/createGitHubIssue.md) (github.createGitHubIssue)

Create a new issue in any repository you can access. Provide a repository slug and title, optionally include a Markdown body. Returns the created issue URL when available.

Example:

```javascript
const { issueUrl } = await mcp.dispatch('github.createGitHubIssue', {
  repository: 'octocat/hello-world',
  title: 'Fix crash when opening large files'
});

if (issueUrl) {
  console.log('Created issue:', issueUrl);
}
```

## [Create GitHub Pull Request](docs/github/createGitHubPullRequest.md) (github.createGitHubPullRequest)

Open a pull request in a GitHub repository. Supply a title (and optional body); optionally set base/head branches or rely on sensible defaults.

Example:

```javascript
const { prUrl } = await mcp.dispatch('github.createGitHubPullRequest', {
  repository: 'owner/repo',
  title: 'Fix: correct pagination on results page'
});

if (prUrl) {
  console.log('Created PR:', prUrl);
}
```

## [Open GitHub Repository](docs/github/openGitHubRepository.md) (github.openGitHubRepository)

Open a GitHub repository in your browser by providing an owner/repo slug. Returns the URL that was opened.

Example:

```javascript
const { repoUrl } = await mcp.dispatch('github.openGitHubRepository', {
  repository: 'microsoft/vscode'
});

console.log('Opened:', repoUrl);
```
