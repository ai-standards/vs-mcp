# VCS Status (vcs.getVcsStatus)

The VCS Status tool returns the current repository’s status as a plain string. It is provider-agnostic: Git, Mercurial, or any VCS supported by your environment. Use it to gate workflows (e.g., only push when clean), surface status to the UI, or script repo-aware actions.

You might need it when you want decisions driven by the repo’s state: uncommitted changes, staged files, conflicts, or a clean working tree. Because the output is the provider’s native status text, you can both display it directly to users and implement lightweight heuristics to drive logic.

## What it does

- Queries the active repository and returns its status as a string.
- Does not require input.
- Works across VCS providers; the exact string format is provider-native.

## Inputs and Outputs

- Input:
  - None.
- Output:
  - status (string, required): Provider-native status text.
  - error (string, optional): Error description if the status could not be retrieved.

Notes:
- The format of status is not standardized across providers. Treat it as display text, and use simple heuristics if you need to branch logic.
- When outside a repository or if the provider is unavailable, error will be set.

## Basic usage

You have mcp (client), server (MCP server), and scope (optional filepath) available in your environment.

```javascript
// Basic: fetch the repository status and log it.
const { status, error } = await mcp.dispatch('vcs.getVcsStatus', {});

if (error) {
  console.error('VCS status error:', error);
} else {
  console.log('Repository status:\n', status);
}
```

## Show the status to the user

Display the status in a VS Code info message. This is the quickest way to surface the repo state without opening a terminal.

```javascript
const { status, error } = await mcp.dispatch('vcs.getVcsStatus', {});

await mcp.dispatch('ui.showInfoMessage', {
  message: error ? `VCS error: ${error}` : status
});
```

## Show progress in the status bar

Wrap the status call with a status bar spinner, then dismiss it when done. If the repo is dirty, also show a window notification.

```javascript
await mcp.dispatch('status.showStatusBar', {
  id: 'vcs:status',
  message: 'Checking VCS…',
  spinner: true
});

try {
  const { status, error } = await mcp.dispatch('vcs.getVcsStatus', {});

  if (error) {
    await mcp.dispatch('showStatusWindow', {
      id: 'vcs:error',
      message: `VCS error: ${error}`
    });
  } else {
    // Heuristic: if status text suggests changes, nudge the user.
    const dirty = !/working tree clean|nothing to commit/i.test(status) && status.trim() !== '';
    if (dirty) {
      await mcp.dispatch('status.showStatusWindow', {
        id: 'vcs:dirty',
        message: 'You have uncommitted changes.'
      });
    }
  }
} finally {
  await mcp.dispatch('status.dismissStatus', { id: 'vcs:status' });
}
```

## Gate pushes on a clean working tree

Only push when the working tree is clean. If not, warn and skip.

```javascript
function isWorkingTreeClean(statusText) {
  if (!statusText) return false;
  const s = statusText.toLowerCase();

  // Common Git hints
  if (s.includes('working tree clean') || s.includes('nothing to commit')) return true;

  // Porcelain-style “no changes”
  if (s.trim() === '') return true;

  // Heuristic: look for clear signs of changes/conflicts
  const dirtyHints = /(modified:|new file:|deleted:|renamed:|untracked files|changes not staged|unstaged|unmerged|conflicts?)/i;
  return !dirtyHints.test(statusText);
}

const statusResult = await mcp.dispatch('vcs.getVcsStatus', {});
if (statusResult.error) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Cannot push: ${statusResult.error}`
  });
} else if (!isWorkingTreeClean(statusResult.status)) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: 'Working tree is not clean. Commit or stash before pushing.'
  });
} else {
  const push = await mcp.dispatch('vcs.pushChanges', {});
  if (push.error) {
    await mcp.dispatch('ui.showWarningMessage', { message: `Push failed: ${push.error}` });
  } else {
    await mcp.dispatch('ui.showInfoMessage', { message: 'Push complete.' });
  }
}
```

## Quick commit if staged changes exist

If the status indicates staged changes, prompt for a message and commit. Otherwise, remind the user to stage files first.

```javascript
const { status, error } = await mcp.dispatch('vcs.getVcsStatus', {});
if (error) {
  await mcp.dispatch('ui.showWarningMessage', { message: `VCS error: ${error}` });
} else {
  const hasStaged = /(changes to be committed|staged)/i.test(status);

  if (!hasStaged) {
    await mcp.dispatch('ui.showInfoMessage', {
      message: 'No staged changes. Stage files before committing.'
    });
  } else {
    const { value: message } = await mcp.dispatch('ui.showInputBox', {
      prompt: 'Commit message'
    });

    if (!message) {
      await mcp.dispatch('ui.showWarningMessage', { message: 'Commit aborted: no message.' });
    } else {
      const commit = await mcp.dispatch('vcs.commitChanges', { message });
      if (commit.error) {
        await mcp.dispatch('ui.showWarningMessage', { message: `Commit failed: ${commit.error}` });
      } else {
        await mcp.dispatch('ui.showInfoMessage', { message: 'Commit successful.' });
      }
    }
  }
}
```

## Open the status in a virtual document

Great for longer outputs or when you want to keep the info visible while working.

```javascript
const { status, error } = await mcp.dispatch('vcs.getVcsStatus', {});
const content = error ? `VCS error:\n${error}` : status;

await mcp.dispatch('editor.openVirtual', {
  content,
  language: 'markdown'
});
```

## Pull-then-status workflow

Pull remote changes, then show the updated status. Abort early if pull fails.

```javascript
const pull = await mcp.dispatch('vcs.pullChanges', {});
if (pull.error) {
  await mcp.dispatch('ui.showWarningMessage', { message: `Pull failed: ${pull.error}` });
} else {
  const { status, error } = await mcp.dispatch('vcs.getVcsStatus', {});
  await mcp.dispatch('ui.showInfoMessage', {
    message: error ? `VCS error: ${error}` : `After pull:\n${status}`
  });
}
```

## Error handling patterns

- If error is set, you are likely outside a repository, the provider is not available, or the workspace has no detected VCS root.
- Treat status as opaque for display purposes. If you branch on content, keep checks conservative and resilient to variations across providers.
- Prefer presenting status to users when uncertain; let them decide the next step (commit, stash, etc.).