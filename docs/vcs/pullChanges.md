# Pull Changes (vcs.pullChanges)

Pull Changes updates your local repository by fetching and merging the latest commits from its remote. Use it to stay current before you push, review changes pulled by teammates, or sync after switching branches.

This tool is provider‑agnostic. It works with any VCS provider available in your environment and respects the active repository in your workspace.

- Tool id: vcs.pullChanges
- Namespace: vcs
- Description: Pull changes from the remote repository (supports any VCS provider).

## When to use

- Before pushing local commits, to avoid rejections due to remote updates.
- After a teammate merges a branch you depend on.
- As part of a “sync” flow, paired with push.

## Output

- success: boolean — whether the pull completed successfully.
- error?: string — an error message when the pull fails or is interrupted (e.g., conflicts, missing remote).

---

## Basic usage

Pull the latest changes for the active repository and notify the user of the result.

```javascript
// You have: mcp (client instance), server (MCP server), scope (optional filepath)
// Basic pull
const { success, error } = await mcp.dispatch('vcs.pullChanges', {});

if (success) {
  await mcp.dispatch('ui.showInfoMessage', {
    message: 'Pulled latest changes.'
  });
} else {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Pull failed${error ? `: ${error}` : ''}`
  });
}
```

---

## Show progress in the status bar

Wrap the pull in a transient status bar indicator so users have feedback during longer operations.

```javascript
// Show a spinner while pulling
await mcp.dispatch('status.showStatusBar', {
  id: 'pull',
  message: 'Pulling…',
  spinner: true
});

try {
  const { success, error } = await mcp.dispatch('vcs.pullChanges', {});

  // Update the status bar outcome
  await mcp.dispatch('status.showStatusBar', {
    id: 'pull',
    message: success ? 'Pull complete' : `Pull failed${error ? `: ${error}` : ''}`,
    spinner: false
  });
} finally {
  // Dismiss after a short moment or immediately if you prefer
  await mcp.dispatch('status.dismissStatus', { id: 'pull' });
}
```

---

## Handle errors and potential conflicts

If the pull fails (e.g., due to conflicts or a non‑fast‑forward issue), surface the error and show repository status for quick context.

```javascript
const result = await mcp.dispatch('vcs.pullChanges', {});

if (!result.success) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Pull failed${result.error ? `: ${result.error}` : ''}`
  });

  // Surface current repository status for context
  const { status, error } = await mcp.dispatch('vcs.getVcsStatus', {});
  await mcp.dispatch('ui.showInfoMessage', {
    message: error ? `Status unavailable: ${error}` : `Repo status:\n${status}`
  });
}
```

---

## Pull-then-push (safe sync)

A common pattern is to pull first, then push local commits if pull succeeded.

```javascript
// Sync: pull first, then push
const pull = await mcp.dispatch('vcs.pullChanges', {});

if (!pull.success) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Sync paused — pull failed${pull.error ? `: ${pull.error}` : ''}`
  });
} else {
  const push = await mcp.dispatch('vcs.pushChanges', {});
  await mcp.dispatch('ui.showInfoMessage', {
    message: push.success ? 'Sync complete (pulled and pushed).' : `Push failed${push.error ? `: ${push.error}` : ''}`
  });
}
```

---

## Confirm before pulling with local changes

Prompt the user before pulling if the repository is not clean, then proceed based on the response.

```javascript
// Check status before pulling
const { status, error: statusError } = await mcp.dispatch('vcs.getVcsStatus', {});

if (statusError) {
  await mcp.dispatch('ui.showWarningMessage', { message: `Cannot read status: ${statusError}` });
} else {
  const dirty = /modified|added|deleted|untracked|conflict/i.test(status);

  if (dirty) {
    const { choice } = await mcp.dispatch('ui.showWarningMessage', {
      message: 'Local changes detected. Pull anyway?',
      actions: ['Pull', 'Cancel']
    });

    if (choice !== 'Pull') {
      await mcp.dispatch('ui.showInfoMessage', { message: 'Pull canceled.' });
    } else {
      const res = await mcp.dispatch('vcs.pullChanges', {});
      await mcp.dispatch('ui.showInfoMessage', {
        message: res.success ? 'Pulled with local changes.' : `Pull failed${res.error ? `: ${res.error}` : ''}`
      });
    }
  } else {
    const res = await mcp.dispatch('vcs.pullChanges', {});
    await mcp.dispatch('ui.showInfoMessage', {
      message: res.success ? 'Pulled (working tree clean).' : `Pull failed${res.error ? `: ${res.error}` : ''}`
    });
  }
}
```

---

## Notes

- The tool acts on the active repository resolved by your environment.
- Provider behavior (e.g., merge vs. rebase) follows your VCS provider’s configuration.
- On failures, check the optional error field. For more detail, call vcs.getVcsStatus and present the status to the user.