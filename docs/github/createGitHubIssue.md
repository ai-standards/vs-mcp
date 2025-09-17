# GitHub: Create Issue (github.createGitHubIssue)

Create a new GitHub issue without leaving VS Code. This tool uses the VS Code GitHub integration to open issues in any repository you can access.

Use it when you need to capture bugs, feature requests, or notes programmatically or via quick UI prompts. It’s ideal for automations, one-off scripts, or workflows that tie editor context to GitHub issues.

- Requires the GitHub Pull Requests and Issues extension for VS Code. Install and sign in: [GitHub Pull Requests and Issues](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github).
- Repository is specified as owner/repo, for example: octocat/hello-world.

## Capabilities

- Create a GitHub issue with a title and optional body.
- Return the created issue URL (VS Code may also open it automatically depending on your setup).
- Works against any repository you have permission to create issues in.

## Inputs

- repository (string, required): Repository slug (owner/repo).
- title (string, required): Issue title.
- body (string, optional): Markdown body.

## Output

- issueUrl: URL of the created issue (string). If the UI auto-opens the issue, this may be null in some environments.

## Basic Usage

Create an issue with the minimal fields: repository and title.

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

## Add a Markdown Body

Provide a clear body with steps, expected vs. actual, and environment details.

```javascript
async function run() {
  const body = [
    '### Steps to Reproduce',
    '1. Open a 500MB+ file',
    '2. Enable syntax highlighting',
    '',
    '### Expected',
    '- Editor remains responsive',
    '',
    '### Actual',
    '- Editor becomes unresponsive for ~10s',
    '',
    '### Environment',
    '- OS: macOS 14.5',
    '- VS Code: 1.92.x'
  ].join('\n');

  const { issueUrl } = await mcp.dispatch('github.createGitHubIssue', {
    repository: 'octocat/hello-world',
    title: 'Editor freezes with very large files',
    body
  });

  await mcp.dispatch('ui.showInfoMessage', {
    message: issueUrl ? `Issue created: ${issueUrl}` : 'Issue created in GitHub.'
  });
}

run().catch(console.error);
```

## Interactive Flow (collect title and body from user)

Use UI prompts to gather input, then create the issue.

```javascript
async function run() {
  const { value: repo } = await mcp.dispatch('ui.showInputBox', {
    prompt: 'Repository (owner/repo):'
  });
  if (!repo) return;

  const { value: title } = await mcp.dispatch('ui.showInputBox', {
    prompt: 'Issue title:'
  });
  if (!title) return;

  const { value: body } = await mcp.dispatch('ui.showInputBox', {
    prompt: 'Issue body (optional):'
  });

  const { issueUrl } = await mcp.dispatch('github.createGitHubIssue', {
    repository: repo,
    title,
    body: body || undefined
  });

  await mcp.dispatch('ui.showInfoMessage', {
    message: issueUrl ? `Issue created: ${issueUrl}` : 'Issue created.'
  });
}

run().catch(console.error);
```

## Use File Content as the Issue Body

Read a file (e.g., logs or error output) and post it as the issue body. This example uses scope as a filepath.

```javascript
async function run() {
  // Pick a workspace root
  const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
  if (!folders || folders.length === 0) {
    await mcp.dispatch('ui.showWarningMessage', { message: 'No workspace folder open.' });
    return;
  }
  const workspaceRoot = folders[0];

  // Ensure scope points to a file to use as the body
  if (!scope) {
    await mcp.dispatch('ui.showWarningMessage', { message: 'No scope filepath provided.' });
    return;
  }

  const { text } = await mcp.dispatch('fs.readFile', {
    path: scope,
    workspaceRoot
  });

  const { issueUrl } = await mcp.dispatch('github.createGitHubIssue', {
    repository: 'octocat/hello-world',
    title: `Error report from ${scope}`,
    body: [
      '### Attached Content',
      '```',
      text,
      '```'
    ].join('\n')
  });

  await mcp.dispatch('ui.showInfoMessage', {
    message: issueUrl ? `Issue created: ${issueUrl}` : 'Issue created with file content.'
  });
}

run().catch(console.error);
```

## Generate an Issue Body with AI, Then Create

Use AI to draft a clean issue body from a short prompt.

```javascript
async function run() {
  const { text: body } = await mcp.dispatch('ai.generateText', {
    prompt: 'Draft a concise GitHub issue describing intermittent timeouts in our API client. Include steps, expected vs. actual, and logs section.',
    temperature: 0.2
  });

  const { issueUrl } = await mcp.dispatch('github.createGitHubIssue', {
    repository: 'octocat/hello-world',
    title: 'Intermittent timeouts in API client',
    body
  });

  await mcp.dispatch('ui.showInfoMessage', {
    message: issueUrl ? `Issue created: ${issueUrl}` : 'Issue created from AI draft.'
  });
}

run().catch(console.error);
```

## Progress and Error Handling

Wrap your call with status messages and graceful error reporting.

```javascript
async function run() {
  try {
    await mcp.dispatch('status.showStatusBar', {
      id: 'create-issue',
      message: 'Creating GitHub issue...',
      spinner: true
    });

    const { issueUrl } = await mcp.dispatch('github.createGitHubIssue', {
      repository: 'octocat/hello-world',
      title: 'Telemetry spike on production'
    });

    await mcp.dispatch('status.dismissStatus', { id: 'create-issue' });

    await mcp.dispatch('ui.showInfoMessage', {
      message: issueUrl ? `Issue created: ${issueUrl}` : 'Issue created.'
    });
  } catch (err) {
    await mcp.dispatch('status.dismissStatus', { id: 'create-issue' });
    await mcp.dispatch('ui.showWarningMessage', {
      message: `Failed to create issue: ${err?.message || String(err)}`
    });
  }
}

run().catch(console.error);
```

## Create Multiple Issues in a Batch

Loop through items and open an issue for each. Add waits if you hit rate limits.

```javascript
async function run() {
  const tasks = [
    { title: 'Document API pagination', body: 'Add paging examples to the README.' },
    { title: 'Add retry policy to client', body: 'Use exponential backoff on 5xx.' }
  ];

  for (const t of tasks) {
    const { issueUrl } = await mcp.dispatch('github.createGitHubIssue', {
      repository: 'octocat/hello-world',
      title: t.title,
      body: t.body
    });

    await mcp.dispatch('ui.showInfoMessage', {
      message: issueUrl ? `Opened: ${issueUrl}` : `Opened: ${t.title}`
    });
  }
}

run().catch(console.error);
```

## Tips

- Use precise repository slugs: owner/repo (e.g., octocat/hello-world). Private repos require appropriate permissions.
- Prefer Markdown in the body for readability (headings, lists, code fences).
- If the tool returns a null URL, VS Code likely opened the issue directly. Check the GitHub panel or your browser.
- Pair with other tools for richer workflows:
  - Collect input with ui.showInputBox.
  - Read files with fs.readFile.
  - Generate text with ai.generateText.
  - Show progress using status.showStatusBar.

## See Also

- Create pull requests: github.createGitHubPullRequest
- Open a repository in the browser: github.openGitHubRepository
- GitHub Issues overview: [GitHub Issues](https://docs.github.com/issues)