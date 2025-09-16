# Git namespace (git)

The git namespace in the vs-mcp extension provides high-level, editor-native Git operations powered by the VS Code Git extension. It lets you create, delete, and merge branches without leaving your coding flow, and works seamlessly with your current workspace and authentication context.

Use these tools to automate common Git tasks in scripts or interactive flows. Prompt users for input, enforce naming conventions, and show progress or results using MCP UI/status tools. Pair git tools with vcs tools (commit, pull, push) to build end-to-end workflows.

Prerequisites:
- Your VS Code workspace is a Git repository.
- The VS Code Git extension is enabled.

## [Create Git Branch](docs/git/createGitBranch.md) (git.createGitBranch)

Create a new branch in the current repository via VS Code’s Git extension. Great for quick feature/bugfix branches, scripted naming conventions, or interactive prompts—all inside MCP workflows.

Example:

```javascript
// Create "feature/login-form"
const result = await mcp.dispatch(
  'git.createGitBranch',
  { branchName: 'feature/login-form' },
  { server, scope }
);

if (!result.success) {
  console.error('Failed to create branch:', result.error);
} else {
  console.log('Branch created: feature/login-form');
}
```

## [Delete Git Branch](docs/git/deleteGitBranch.md) (git.deleteGitBranch)

Delete a local branch by name using VS Code’s Git integration—ideal for tidying up after merges or scripting repository hygiene. This affects local branches only and cannot delete the currently checked-out branch.

Example:

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

## [Merge Git Branch](docs/git/mergeGitBranch.md) (git.mergeGitBranch)

Merge the specified branch into your currently checked-out branch using VS Code’s Git extension. Useful for syncing feature branches, preparing releases, or automating merge steps with UI prompts and status feedback.

Example:

```javascript
// You have: mcp (client), server (MCP server), scope (optional filepath context)

const { value: branchName } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Which branch do you want to merge into the current branch?'
});

if (!branchName) {
  await mcp.dispatch('ui.showWarningMessage', { message: 'No branch provided. Merge cancelled.' });
} else {
  const { success, error } = await mcp.dispatch('git.mergeGitBranch', {
    branchName
  });

  if (success) {
    await mcp.dispatch('ui.showInfoMessage', { message: `Merged '${branchName}' into current branch.` });
  } else {
    await mcp.dispatch('ui.showWarningMessage', {
      message: `Merge failed for '${branchName}': ${error || 'Unknown error'}`
    });
  }
}
```