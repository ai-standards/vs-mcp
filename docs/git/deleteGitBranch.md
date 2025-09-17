# Delete Git Branch (git.deleteGitBranch)

Delete a local Git branch from your current repository using VS Code’s Git integration—no shell, no fuss. This tool is perfect for cleaning up branches after merges, pruning stale spikes, or enforcing a tidy repo policy.

You might need it when you:
- Merge a feature and want to remove the source branch.
- Standardize branch hygiene during CI/CD workflows.
- Script repository maintenance directly inside VS Code.

It delegates to VS Code’s Git extension, so it operates on the repository VS Code recognizes as “current.”

## What it does (and doesn’t)

- Deletes a local branch by name.
- Fails if the branch does not exist or cannot be safely deleted.
- Does not delete remote branches.
- Cannot delete the currently checked-out branch (Git restriction).

For general Git behavior, see the VS Code docs: [Source Control in VS Code](https://code.visualstudio.com/docs/sourcecontrol/overview).

## API

- Namespace: **git**
- Tool: **deleteGitBranch**
- Input:
  - branchName: string (required)
- Output:
  - success: boolean
  - error?: string

## Examples

Assumptions for all examples:
- You have:
  - an MCP client instance: `mcp`
  - an MCP server instance: `server`
  - an optional `scope` (a workspace or repo root path you use in your app’s context)

All calls use `mcp.dispatch(...)`.

### Basic: delete a branch by name

Delete a local branch called feature/login.

```javascript
// given
const server = /* your mcp server */;
const scope = '/path/to/repo'; // optional, if your client uses it

const { success, error } = await mcp.dispatch('git.deleteGitBranch', {
  branchName: 'feature/login',
});

if (!success) {
  console.error('Delete failed:', error ?? 'Unknown error');
} else {
  console.log('Branch deleted');
}
```

### Prompt for the branch name, then delete

Ask the user which branch to delete, then perform the deletion.

```javascript
// given
const server = /* your mcp server */;
const scope = '/path/to/repo';

const { value: branchName } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Branch to delete (local):',
});

if (!branchName) {
  console.log('No branch provided. Aborting.');
} else {
  const { success, error } = await mcp.dispatch('git.deleteGitBranch', { branchName });

  if (!success) {
    console.error(`Could not delete "${branchName}":`, error ?? 'Unknown error');
  } else {
    console.log(`Deleted "${branchName}"`);
  }
}
```

### Confirm before deleting

Display a confirmation UI to avoid accidental branch removal.

```javascript
// given
const server = /* your mcp server */;
const scope = '/path/to/repo';

const branchName = 'feature/cleanup';

const { choice } = await mcp.dispatch('ui.showInfoMessage', {
  message: `Delete local branch "${branchName}"?`,
  actions: ['Yes', 'No'],
});

if (choice !== 'Yes') {
  console.log('User canceled.');
} else {
  const { success, error } = await mcp.dispatch('git.deleteGitBranch', { branchName });
  if (!success) {
    console.error('Delete failed:', error ?? 'Unknown error');
  } else {
    console.log('Branch deleted');
  }
}
```

### Merge first, then delete

If you want to merge a branch into your current branch and then remove it, chain the tools.

```javascript
// given
const server = /* your mcp server */;
const scope = '/path/to/repo';

const target = 'feature/api-v2';

// 1) Merge the branch into the current branch.
const merge = await mcp.dispatch('git.mergeGitBranch', { branchName: target });

if (!merge.success) {
  console.error(`Merge failed for "${target}":`, merge.error ?? 'Unknown error');
} else {
  // 2) Delete the merged branch.
  const del = await mcp.dispatch('git.deleteGitBranch', { branchName: target });
  if (!del.success) {
    console.error(`Delete failed for "${target}":`, del.error ?? 'Unknown error');
  } else {
    console.log(`Merged and deleted "${target}"`);
  }
}
```

### Show progress while deleting

Use the status bar to signal activity and completion.

```javascript
// given
const server = /* your mcp server */;
const scope = '/path/to/repo';

const id = 'git-delete-branch';
const branchName = 'feature/legacy-prune';

await mcp.dispatch('status.showStatusBar', {
  id,
  message: `Deleting ${branchName}...`,
  spinner: true,
});

const { success, error } = await mcp.dispatch('git.deleteGitBranch', { branchName });

await mcp.dispatch('status.dismissStatus', { id });

if (!success) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Failed to delete "${branchName}": ${error ?? 'Unknown error'}`,
  });
} else {
  await mcp.dispatch('showStatusWindow', {
    id: 'git-delete-branch-done',
    message: `Deleted "${branchName}"`,
  });
}
```

### Delete multiple branches (simple loop)

If you already know which branches to remove, loop through them. Each delete is independent.

```javascript
// given
const server = /* your mcp server */;
const scope = '/path/to/repo';

const branches = ['feature/a', 'feature/b', 'bugfix/old'];

for (const branchName of branches) {
  const { success, error } = await mcp.dispatch('git.deleteGitBranch', { branchName });
  if (!success) {
    console.warn(`Could not delete "${branchName}":`, error ?? 'Unknown error');
  } else {
    console.log(`Deleted "${branchName}"`);
  }
}
```

## Behavior notes and troubleshooting

- You cannot delete the branch you are currently on. Checkout a different branch first.
- Unmerged work may block deletion. Merge or force-delete in your Git client if appropriate. This tool performs a safe delete via VS Code’s Git API.
- This affects local branches only. To remove the remote branch, delete it on the remote (e.g., via your Git hosting provider or CLI).
- If multiple repositories are open, ensure the correct repo is selected in VS Code’s Source Control view.

## See also

- Create a branch: git.createGitBranch
- Merge a branch: git.mergeGitBranch
- Commit, pull, and push: vcs.commitChanges, vcs.pullChanges, vcs.pushChanges
- Show prompts and messages: ui.showInputBox, ui.showInfoMessage, ui.showWarningMessage