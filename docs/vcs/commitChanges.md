# VCS: Commit Changes

Commit Changes is a small, sharp tool: it commits currently staged changes in your workspace using the editor’s VCS integration. It works across providers (Git and others supported by VS Code), so you don’t need to shell out or install extra CLIs.

You’ll use it when you’ve staged edits and want to create a commit with a clear message. It pairs well with tools that prompt the user, show status, or push to remote. Keep your flow inside the editor, keep your commits disciplined.

## What it does

- Commits staged changes in the current repository.
- Requires a commit message.
- Returns a success flag and optional error text.

## When to use it

- After staging changes in the Source Control view.
- In automated or interactive flows that gather a message, commit, then optionally push.
- When you want consistent behavior across VCS providers without depending on external binaries.

## Inputs and outputs

- Input
  - message: string (required)
- Output
  - success: boolean
  - error?: string

## Basic usage

Commit staged changes with a fixed message.

```javascript
// Assume: `mcp`, `server`, and optional `scope` (filepath) are available in your environment.

const { success, error } = await mcp.dispatch('vcs.commitChanges', {
  message: 'chore: snapshot before refactor'
});

if (!success) {
  console.error('Commit failed:', error);
}
```

## Prompt for a message, then commit

Ask the user for a message and commit only if provided.

```javascript
const { value: message } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Commit message'
});

if (!message) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: 'Commit canceled (no message provided).'
  });
} else {
  const { success, error } = await mcp.dispatch('vcs.commitChanges', { message });

  if (!success) {
    await mcp.dispatch('ui.showWarningMessage', {
      message: `Commit failed: ${error || 'Unknown error'}`
    });
  } else {
    await mcp.dispatch('ui.showInfoMessage', {
      message: 'Committed staged changes.'
    });
  }
}
```

## Commit with a status bar indicator

Wrap the commit in a status bar message and clean up after.

```javascript
const id = 'commit:in-progress';

await mcp.dispatch('status.showStatusBar', {
  id,
  message: 'Committing…',
  spinner: true
});

try {
  const { success, error } = await mcp.dispatch('vcs.commitChanges', {
    message: 'feat: add search filters'
  });

  if (!success) {
    await mcp.dispatch('ui.showWarningMessage', {
      message: `Commit failed: ${error || 'Unknown error'}`
    });
  } else {
    await mcp.dispatch('status.showStatusBar', {
      id,
      message: 'Commit complete',
      spinner: false
    });
  }
} finally {
  await mcp.dispatch('status.dismissStatus', { id });
}
```

## Interactive: guide the user to a Conventional Commit

Nudge toward a consistent format, then commit.

```javascript
const { value: type } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Type (feat, fix, docs, chore, refactor, test, perf, build, ci)'
});

if (!type) {
  await mcp.dispatch('ui.showWarningMessage', { message: 'Commit canceled.' });
} else {
  const { value: subject } = await mcp.dispatch('ui.showInputBox', {
    prompt: 'Short, imperative subject (no period)'
  });

  if (!subject) {
    await mcp.dispatch('ui.showWarningMessage', { message: 'Commit canceled.' });
  } else {
    const message = `${type}: ${subject}`;
    const { success, error } = await mcp.dispatch('vcs.commitChanges', { message });

    if (!success) {
      await mcp.dispatch('ui.showWarningMessage', {
        message: `Commit failed: ${error || 'Unknown error'}`
      });
    } else {
      await mcp.dispatch('ui.showInfoMessage', {
        message: `Committed: ${message}`
      });
    }
  }
}
```

## Commit, then push

Create the commit and push if commit succeeds.

```javascript
const { success: committed, error: commitError } = await mcp.dispatch('vcs.commitChanges', {
  message: 'fix: handle null workspace root'
});

if (!committed) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Commit failed: ${commitError || 'Unknown error'}`
  });
} else {
  const { success: pushed, error: pushError } = await mcp.dispatch('vcs.pushChanges', {});
  if (!pushed) {
    await mcp.dispatch('ui.showWarningMessage', {
      message: `Push failed: ${pushError || 'Unknown error'}`
    });
  } else {
    await mcp.dispatch('ui.showInfoMessage', { message: 'Commit pushed.' });
  }
}
```

## Check repository status before committing

Get a status snapshot and decide whether to continue. This doesn’t stage changes; it’s a quick sanity check.

```javascript
const { status, error: statusError } = await mcp.dispatch('vcs.getVcsStatus', {});
if (statusError) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Cannot read repository status: ${statusError}`
  });
} else {
  // Optionally inspect `status` to decide whether to proceed.
  const { success, error } = await mcp.dispatch('vcs.commitChanges', {
    message: 'refactor: simplify options resolution'
  });

  if (!success) {
    await mcp.dispatch('ui.showWarningMessage', {
      message: `Commit failed: ${error || 'Unknown error'}`
    });
  }
}
```

## Error handling pattern

Centralize error reporting for reliability.

```javascript
async function commitOrWarn(message) {
  const { success, error } = await mcp.dispatch('vcs.commitChanges', { message });
  if (!success) {
    await mcp.dispatch('ui.showWarningMessage', {
      message: `Commit failed: ${error || 'Unknown error'}`
    });
  }
  return success;
}

await commitOrWarn('docs: update API table');
```

## Notes and tips

- Only staged changes are committed. Stage in the Source Control view or your provider’s workflow.
- Use clear, concise messages. Prefer imperative mood. Consider Conventional Commits for structure.
- Chain with Pull or Push when automating flows:
  - Pull first to reduce push conflicts.
  - Commit.
  - Push on success.
- This tool is provider-agnostic; behavior is routed through the editor’s VCS integration.