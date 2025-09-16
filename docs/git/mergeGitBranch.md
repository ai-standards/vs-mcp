# git.mergeGitBranch — Merge Git Branch

Merge the specified branch into your current branch using VS Code’s Git extension. This tool removes the need to jump into a terminal for routine merges and keeps your workflow consistent inside MCP-driven automations.

Use it when you need to bring changes from another branch (e.g., feature or hotfix) into your currently checked-out branch. It’s useful in scripts that prepare a branch for release, sync long-lived branches, or gate merges behind UI prompts.

- Input: one required string, the branch name to merge from.
- Behavior: merges into whatever branch is currently checked out.
- Output: a success flag and optional error message.

## Before You Use It

- Be on the branch you want to merge into (e.g., check out feature/foo if you want to merge main into feature/foo).
- Ensure your working tree is clean or changes are committed/stashed—Git may block merges otherwise.
- This uses VS Code’s Git extension; a Git repository must be open in the workspace.

## Inputs and Outputs

- Input
  - branchName (string, required): the name of the branch to merge into the current branch.
- Output
  - success (boolean): true if the merge completed; false otherwise.
  - error (string, optional): message when the merge fails or is blocked (e.g., conflicts).

## Basic Usage

Prompt for a branch name, then merge it into the current branch.

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

## Merge a Known Branch

When you already know the branch name, call the tool directly.

```javascript
const { success, error } = await mcp.dispatch('git.mergeGitBranch', {
  branchName: 'feature/login'
});

if (!success) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Merge failed: ${error || 'Unknown error'}`
  });
}
```

## Show Progress in the Status Bar

Use the status tools to show a spinner while merging, then dismiss it.

```javascript
await mcp.dispatch('status.showStatusBar', {
  id: 'merge-progress',
  message: 'Merging branch…',
  spinner: true
});

const { success, error } = await mcp.dispatch('git.mergeGitBranch', {
  branchName: 'release/1.2.0'
});

await mcp.dispatch('status.dismissStatus', { id: 'merge-progress' });

await mcp.dispatch(success ? 'ui.showInfoMessage' : 'ui.showWarningMessage', {
  message: success ? 'Merge complete.' : `Merge failed: ${error || 'Unknown error'}`
});
```

## Reduce Conflicts: Pull Then Merge

Pull latest changes before merging to minimize conflicts.

```javascript
const pull = await mcp.dispatch('vcs.pullChanges', {});
if (!pull.success) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Pull failed: ${pull.error || 'Unknown error'}`
  });
} else {
  const { success, error } = await mcp.dispatch('git.mergeGitBranch', {
    branchName: 'main'
  });

  await mcp.dispatch(success ? 'ui.showInfoMessage' : 'ui.showWarningMessage', {
    message: success ? 'Merge from main complete.' : `Merge failed: ${error || 'Unknown error'}`
  });
}
```

## Handle Merge Conflicts Gracefully

If Git reports conflicts, surface a clear message and let users resolve them in VS Code.

```javascript
const { success, error } = await mcp.dispatch('git.mergeGitBranch', {
  branchName: 'hotfix/urgent'
});

if (!success) {
  const isConflict = typeof error === 'string' && /conflict/i.test(error);
  await mcp.dispatch('ui.showWarningMessage', {
    message: isConflict
      ? 'Merge has conflicts. Resolve them in VS Code, then commit the merge.'
      : `Merge failed: ${error || 'Unknown error'}`
  });
}
```

## Check Repository Status Before and After

Quickly snapshot repo status around the merge.

```javascript
const before = await mcp.dispatch('vcs.getVcsStatus', {});
const merge = await mcp.dispatch('git.mergeGitBranch', { branchName: 'develop' });
const after = await mcp.dispatch('vcs.getVcsStatus', {});

await mcp.dispatch('ui.showInfoMessage', {
  message: merge.success
    ? 'Merge succeeded.'
    : `Merge failed: ${merge.error || 'Unknown error'}`
});

// Optionally open a virtual document showing status diff
await mcp.dispatch('editor.openVirtual', {
  language: 'markdown',
  content: [
    '# VCS Status',
    '## Before',
    before.status || '(no status)',
    '## After',
    after.status || '(no status)'
  ].join('\n\n')
});
```

## Notes and Best Practices

- You merge into the currently checked-out branch. To merge main into feature/foo, ensure feature/foo is checked out first.
- This tool does not pull or push; pair with vcs.pullChanges and vcs.pushChanges as needed.
- If conflicts occur, VS Code will show markers in files. Resolve them, then commit via MCP (vcs.commitChanges) or the Git UI.
- Branch must exist in your repo. If you need it, create it first via git.createGitBranch.

## See Also

- Create a branch: git.createGitBranch
- Delete a branch: git.deleteGitBranch
- Commit changes: vcs.commitChanges
- Pull changes: vcs.pullChanges
- Push changes: vcs.pushChanges
- Repository status: vcs.getVcsStatus