# GitHub: Create Pull Request (github.createGitHubPullRequest)

Create a pull request without leaving VS Code. This tool delegates to VS Code’s GitHub integration, so it respects your signed-in account, repository permissions, and workspace context.

Use it when you’ve pushed a branch and want to propose changes into a base branch (often main). You can supply a title, optional body, and optionally choose base/head branches. If you omit base/head, the integration will use sensible defaults.

- Namespace: **github**
- Tool ID: **createGitHubPullRequest**
- Description: Create a new pull request in a GitHub repository using VS Code's GitHub integration.

## Inputs and Output

- Inputs
  - **repository** (string, required): The GitHub repository, e.g. "owner/repo".
  - **title** (string, required): The pull request title.
  - **body** (string, optional): The pull request description (Markdown supported by GitHub).
  - **base** (string, optional): The target branch you want to merge into (e.g. "main").
  - **head** (string, optional): The source branch containing your changes (e.g. "feature/login").
- Output
  - **prUrl** (required): URL to the created PR if provided by the host. Treat as optional in practice; some environments open the PR UI or browser without returning a URL.

Prerequisites:
- You must be signed into GitHub in VS Code and have access to the target repository.
- Your head branch must exist on the remote (push it first).

## Basic usage

Create a PR with the minimum required fields. All examples assume you have these variables available:
- mcp: the MCP client instance
- server: the connected MCP server
- scope: optional filepath context

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

## Add a PR body (Markdown)

Include a descriptive body to make reviews easier. GitHub supports Markdown, checklists, and code blocks.

```javascript
const body = `
### Summary
Fix pagination off-by-one when navigating beyond the last page.

### Changes
- Guard negative page index
- Clamp page upper bound
- Add tests for boundary conditions

### Screenshots
(n/a)

### Checklist
- [x] Tests added
- [x] Verified on Linux + macOS
`;

const { prUrl } = await mcp.dispatch('github.createGitHubPullRequest', {
  repository: 'owner/repo',
  title: 'Fix: pagination boundary conditions',
  body
});

if (prUrl) {
  console.log('Created PR:', prUrl);
}
```

## Specify base and head branches

Control exactly which branches participate in the PR. This is useful for release branches or backports.

```javascript
const { prUrl } = await mcp.dispatch('github.createGitHubPullRequest', {
  repository: 'owner/repo',
  title: 'feat(auth): OAuth device flow',
  body: 'Implements device flow for headless devices.',
  base: 'main',              // target branch
  head: 'feature/device-oauth' // source branch
});

if (prUrl) {
  console.log('Created PR:', prUrl);
}
```

## Interactive: prompt for title and body

Gather details from the user at runtime with the UI tools, then create the PR.

```javascript
// Prompt for PR title
const { value: title } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'PR title'
});
if (!title) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: 'PR title is required.'
  });
  return;
}

// Prompt for PR body (optional)
const { value: body } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'PR body (optional)',
  placeHolder: 'Describe what changed and why'
});

// Create the PR
const { prUrl } = await mcp.dispatch('github.createGitHubPullRequest', {
  repository: 'owner/repo',
  title,
  body: body || undefined
});

await mcp.dispatch('ui.showInfoMessage', {
  message: prUrl ? `PR created: ${prUrl}` : 'PR created.'
});
```

## End-to-end: create branch, commit, push, then open a PR

A typical flow: create a branch, commit the staged work, push, then file a PR.

```javascript
// 1) Create a branch for the work
await mcp.dispatch('git.createGitBranch', {
  branchName: 'feature/pagination-guard'
});

// 2) Commit staged changes (ensure you have staged files via VS Code/Git before this step)
await mcp.dispatch('vcs.commitChanges', {
  message: 'feat: add pagination guard and tests'
});

// 3) Push the branch to origin
await mcp.dispatch('vcs.pushChanges', {});

// 4) Create the PR into main
const { prUrl } = await mcp.dispatch('github.createGitHubPullRequest', {
  repository: 'owner/repo',
  title: 'feat: add pagination guard and tests',
  body: 'Prevents navigating to negative or out-of-range pages.',
  base: 'main',
  head: 'feature/pagination-guard'
});

await mcp.dispatch('ui.showInfoMessage', {
  message: prUrl ? `PR created: ${prUrl}` : 'PR created.'
});
```

## Robust error handling

Wrap the flow in try/catch and surface actionable feedback to the user.

```javascript
try {
  const { prUrl } = await mcp.dispatch('github.createGitHubPullRequest', {
    repository: 'owner/repo',
    title: 'chore: update dependencies',
    body: 'Updates minor and patch versions.'
  });

  await mcp.dispatch('ui.showInfoMessage', {
    message: prUrl ? `PR created: ${prUrl}` : 'PR created.'
  });
} catch (err) {
  const message = err?.message || String(err);
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Failed to create PR: ${message}`
  });
}
```

## Tips

- Repository format: use owner/name (e.g., "microsoft/vscode"). If your workspace maps to that remote, you can reuse it consistently.
- If you omit base and head, the integration typically selects the default base and your current branch as head.
- Ensure your head branch is already pushed to the remote; otherwise creation can fail or prompt you to publish.
- Prefer clear, scoped titles and actionable bodies. Reviewers appreciate concise summaries and explicit test notes.