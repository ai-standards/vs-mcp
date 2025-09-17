# Create Git Branch (git.createGitBranch)

Create a new Git branch in the current repository without leaving your editor. This tool delegates to VS Code’s Git extension, so it respects your workspace and authentication context.

You’ll use this when you want to branch quickly for a feature, bugfix, or experiment, and you prefer automation over terminal incantations. It’s ideal for interactive flows (prompt the user, validate a name, then create) or for scripted workflows (generate a branch name, create, and continue).

- Backend: VS Code Git extension
- Workspace scope: Current repository in your VS Code window
- Great for: Feature/bugfix branches, repeatable naming conventions, interactive prompts

## Before you start

- You’re inside a VS Code workspace that is a Git repository.
- The VS Code Git extension is enabled. See [Version Control in VS Code](https://code.visualstudio.com/docs/sourcecontrol/overview).

## Tool reference

- Namespace: **git**
- ID: **createGitBranch**
- Description: Create a new branch in the current repository using VS Code’s Git extension.
- Input:
  - **branchName** (string, required): The branch name to create (e.g., "feature/login-form").
- Output:
  - **success** (boolean): Indicates whether creation succeeded.
  - **error** (string, optional): Error info when creation fails.

Note: All examples assume you have variables `mcp`, `server`, and `scope` (an optional filepath) available.

## Basic usage

Create a branch with a known name. This is the fastest path when your branch name is already decided.

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

## Interactive: prompt for the branch name

When you don’t want to hardcode the name, prompt the user and then create the branch.

```javascript
// Ask the user for a branch name
const { value: branchName } = await mcp.dispatch(
  'ui.showInputBox',
  { prompt: 'New branch name (e.g., feature/login-form):' },
  { server, scope }
);

if (!branchName) {
  console.log('No branch name provided. Aborting.');
} else {
  const result = await mcp.dispatch(
    'git.createGitBranch',
    { branchName },
    { server, scope }
  );

  if (!result.success) {
    console.error('Failed to create branch:', result.error);
  } else {
    console.log(`Branch created: ${branchName}`);
  }
}
```

## Apply a naming convention

Keep your branches consistent by generating names from a simple rule, then creating them.

```javascript
// Convert a title into a safe branch slug
function toSlug(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')    // remove punctuation
    .replace(/\s+/g, '-')        // spaces to dashes
    .replace(/-+/g, '-');        // collapse dashes
}

const { value: title } = await mcp.dispatch(
  'ui.showInputBox',
  { prompt: 'Describe your change (e.g., Add OAuth login)' },
  { server, scope }
);

if (!title) {
  console.log('No description provided. Aborting.');
} else {
  const branchName = `feature/${toSlug(title)}`;

  const result = await mcp.dispatch(
    'git.createGitBranch',
    { branchName },
    { server, scope }
  );

  if (!result.success) {
    console.error('Failed to create branch:', result.error);
  } else {
    console.log(`Branch created: ${branchName}`);
  }
}
```

## Show progress in the status bar

Give instant feedback during longer or scripted operations by using a status message around branch creation.

```javascript
// Show a spinner while creating the branch
const id = 'git:create-branch';
await mcp.dispatch(
  'status.showStatusBar',
  { id, message: 'Creating branch…', spinner: true },
  { server, scope }
);

try {
  const result = await mcp.dispatch(
    'git.createGitBranch',
    { branchName: 'bugfix/handle-429' },
    { server, scope }
  );

  if (!result.success) {
    await mcp.dispatch(
      'status.showStatusWindow',
      { id, message: `Branch creation failed: ${result.error || 'Unknown error'}` },
      { server, scope }
    );
  } else {
    await mcp.dispatch(
      'status.showStatusWindow',
      { id, message: 'Branch created: bugfix/handle-429' },
      { server, scope }
    );
  }
} finally {
  await mcp.dispatch(
    'status.dismissStatus',
    { id },
    { server, scope }
  );
}
```

## Defensive error handling

Handle common failures gracefully: invalid names, branch already exists, or no repository open.

```javascript
function isValidBranchName(name) {
  // Basic screening; Git has more rules, but this catches common issues.
  return typeof name === 'string'
    && name.length > 0
    && !name.endsWith('/')
    && !name.includes('..')
    && !/[~^:?*\s]/.test(name);
}

const { value: rawName } = await mcp.dispatch(
  'ui.showInputBox',
  { prompt: 'Branch name:' },
  { server, scope }
);

if (!rawName) {
  console.log('Aborted by user.');
} else if (!isValidBranchName(rawName)) {
  await mcp.dispatch(
    'ui.showWarningMessage',
    { message: `Invalid branch name: "${rawName}"` },
    { server, scope }
  );
} else {
  const result = await mcp.dispatch(
    'git.createGitBranch',
    { branchName: rawName },
    { server, scope }
  );

  if (!result.success) {
    // Example: "branch already exists", "no repository found", etc.
    await mcp.dispatch(
      'ui.showWarningMessage',
      { message: `Failed to create branch: ${result.error || 'Unknown error'}` },
      { server, scope }
    );
  } else {
    console.log(`Created: ${rawName}`);
  }
}
```

## Tips

- Keep names short and meaningful. Prefix with feature/, bugfix/, chore/, or release/ to encode intent.
- Avoid spaces and special characters. Stick to lowercase, dashes, and slashes.
- If you see repeated failures, verify the workspace has an initialized Git repository and the Git extension is active.

That’s it—clean, predictable branch creation directly from your MCP workflows.