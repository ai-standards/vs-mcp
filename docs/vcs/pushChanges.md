# Push Changes (vcs.pushChanges)

Push committed work from your local repository to its remote with one call. This tool wraps your editor’s VCS integration, so it works regardless of whether the repo is Git, GitHub-backed, or another provider supported by your environment.

Use it when you’ve already committed changes and want to publish them upstream. It pairs naturally with commit, pull, status, and even GitHub PR creation for a clean “commit → push → PR” workflow.

- Namespace: **vcs**
- Tool ID: **vcs.pushChanges**
- Description: Push committed changes to the remote repository (supports any VCS provider).

## Inputs and outputs

- Input
  - None (the current repository is inferred; use a path-based scope to disambiguate in multi-repo workspaces).
- Output
  - success: boolean
  - error?: string

## Basic usage

Push whatever is already committed in the current repository. Assumes you have:
- mcp: an MCP client instance
- mcpServer: the MCP server instance (available if you need it)
- scope: optional absolute path to a file or folder inside the target repository (useful in multi-root setups)

```javascript
// Assumes: const mcp = /* MCP client */; const mcpServer = /* MCP server */; const scope = /* optional repo path */;

const { success, error } = await mcp.dispatch('vcs.pushChanges', {}, { scope });

if (!success) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Push failed${error ? `: ${error}` : ''}`,
    actions: ['OK']
  });
}
```

## Patterns and examples

### Push after committing changes

If you haven’t committed yet, do that first, then push. Keep messages crisp and meaningful.

```javascript
// Commit staged changes, then push.
const commit = await mcp.dispatch('vcs.commitChanges', { message: 'feat: add user preferences panel' }, { scope });

if (!commit.success) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Commit failed${commit.error ? `: ${commit.error}` : ''}`,
    actions: ['OK']
  });
} else {
  const push = await mcp.dispatch('vcs.pushChanges', {}, { scope });
  if (!push.success) {
    await mcp.dispatch('ui.showWarningMessage', {
      message: `Push failed${push.error ? `: ${push.error}` : ''}`,
      actions: ['OK']
    });
  } else {
    await mcp.dispatch('ui.showInfoMessage', {
      message: 'Changes pushed successfully.',
      actions: ['Nice']
    });
  }
}
```

### Pull-then-push to avoid non-fast-forward errors

If the remote might be ahead, sync first.

```javascript
// Pull latest, resolve, then push.
const pulled = await mcp.dispatch('vcs.pullChanges', {}, { scope });

if (!pulled.success) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Pull failed${pulled.error ? `: ${pulled.error}` : ''}`,
    actions: ['OK']
  });
} else {
  const pushed = await mcp.dispatch('vcs.pushChanges', {}, { scope });
  if (!pushed.success) {
    await mcp.dispatch('ui.showWarningMessage', {
      message: `Push failed${pushed.error ? `: ${pushed.error}` : ''}`,
      actions: ['OK']
    });
  } else {
    await mcp.dispatch('ui.showInfoMessage', { message: 'Pull + push completed.', actions: ['Great'] });
  }
}
```

### Show progress in the status bar

Surface long-running operations to the user. Start a spinner, push, then dismiss.

```javascript
await mcp.dispatch('status.showStatusBar', {
  id: 'vcs:push',
  message: 'Pushing changes…',
  spinner: true
});

try {
  const { success, error } = await mcp.dispatch('vcs.pushChanges', {}, { scope });
  if (!success) {
    await mcp.dispatch('ui.showWarningMessage', {
      message: `Push failed${error ? `: ${error}` : ''}`,
      actions: ['OK']
    });
  } else {
    await mcp.dispatch('status.showStatusWindow', {
      id: 'vcs:push:done',
      message: 'Push completed.'
    });
  }
} finally {
  await mcp.dispatch('status.dismissStatus', { id: 'vcs:push' });
}
```

### Verify repository status before and after pushing

Use status to verify cleanliness or to gate your workflow.

```javascript
// Pre-check
const before = await mcp.dispatch('vcs.getVcsStatus', {}, { scope });
// You can choose to abort if status indicates issues.
// For demonstration, we push regardless.

const pushed = await mcp.dispatch('vcs.pushChanges', {}, { scope });

if (!pushed.success) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Push failed${pushed.error ? `: ${pushed.error}` : ''}`,
    actions: ['OK']
  });
} else {
  const after = await mcp.dispatch('vcs.getVcsStatus', {}, { scope });
  await mcp.dispatch('ui.showInfoMessage', {
    message: `Push succeeded. Status was: ${before.status}. Now: ${after.status}`,
    actions: ['OK']
  });
}
```

### Multi-root workspaces: target the right repo with scope

When your workspace contains multiple repositories, pass a path inside the desired repo via scope. The tool uses it to pick the correct repository context.

```javascript
// Example scopes:
const apiRepoScope = '/work/monorepo/packages/api';
const webRepoScope = '/work/monorepo/apps/web';

// Push API repo
await mcp.dispatch('vcs.pushChanges', {}, { scope: apiRepoScope });

// Push Web app repo
await mcp.dispatch('vcs.pushChanges', {}, { scope: webRepoScope });
```

### Commit → Push → Open a Pull Request

Finish with a PR to start review. Provide the repository slug in owner/name format for GitHub tools.

```javascript
// 1) Commit
const commit = await mcp.dispatch('vcs.commitChanges', { message: 'fix: handle null preference set' }, { scope });
if (!commit.success) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Commit failed${commit.error ? `: ${commit.error}` : ''}`,
    actions: ['OK']
  });
  return;
}

// 2) Push
const push = await mcp.dispatch('vcs.pushChanges', {}, { scope });
if (!push.success) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Push failed${push.error ? `: ${push.error}` : ''}`,
    actions: ['OK']
  });
  return;
}

// 3) Create PR (adjust repository, base, head as needed)
const pr = await mcp.dispatch('github.createGitHubPullRequest', {
  repository: 'your-org/your-repo',
  title: 'Fix: handle null preference set',
  body: 'This PR fixes the crash when preferences are null.',
  base: 'main',
  head: 'your-branch'
}, { scope });

await mcp.dispatch('ui.showInfoMessage', {
  message: `PR created: ${pr.prUrl ?? 'see GitHub'}`,
  actions: ['Open']
});
```

## Error handling tips

- No upstream branch: your provider may require setting an upstream on first push. If the push fails with an error indicating no upstream, create or switch to the correct branch and try again. You can pair this with a UI prompt to guide the user.
- Authentication or permission errors: ensure you’re signed in via your editor’s VCS integration.
- Non-fast-forward: pull first, resolve conflicts, then push.
- Ambiguous repository: pass a precise scope in multi-repo environments.

```javascript
const result = await mcp.dispatch('vcs.pushChanges', {}, { scope });

if (!result.success) {
  const message = result.error || 'Unknown push error';
  await mcp.dispatch('ui.showWarningMessage', { message, actions: ['OK'] });
}
```

## Summary

- Use vcs.pushChanges to publish committed work upstream.
- Combine with vcs.commitChanges, vcs.pullChanges, and vcs.getVcsStatus for robust flows.
- Provide scope to disambiguate repositories in multi-root workspaces.
- Wrap operations with status and UI tools to keep users informed.