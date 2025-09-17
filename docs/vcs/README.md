# vcs namespace

The vcs namespace provides version control operations through your editor’s built‑in VCS integration. It is provider‑agnostic, so the same tools work whether you’re using Git or another VCS supported by VS Code. These tools let you commit staged changes, pull from remotes, push local commits, and read repository status without shelling out or installing external CLIs.

Use vcs tools to keep your workflow inside the editor: automate common flows (pull → commit → push), surface status to users, or gate actions on repository state. They pair well with UI and status utilities (prompts, notifications, status bar indicators). In multi‑root workspaces, pass a scope (path inside the target repo) to disambiguate which repository to act on.

## [Commit Changes](docs/vcs/vcs.commitChanges.md)

Commit staged changes in the current repository with a clear message. It relies on the editor’s VCS integration, so behavior is consistent across providers. Use it after staging edits, or as part of automated flows that prompt for a message, commit, then push.

Example: commit staged changes with a fixed message.

```javascript
// Assume: `mcp`, `server`, and optional `scope` (filepath) are available in your environment.

const { success, error } = await mcp.dispatch('vcs.commitChanges', {
  message: 'chore: snapshot before refactor'
});

if (!success) {
  console.error('Commit failed:', error);
}
```

## [VCS Status](docs/vcs/vcs.getVcsStatus.md)

Retrieve the active repository’s status as provider‑native text. Use it to display status to users, decide whether to proceed with pushes, or build simple heuristics (e.g., detect a clean working tree). If status can’t be retrieved, an error is returned.

Example: fetch the repository status and log it.

```javascript
// Basic: fetch the repository status and log it.
const { status, error } = await mcp.dispatch('vcs.getVcsStatus', {});

if (error) {
  console.error('VCS status error:', error);
} else {
  console.log('Repository status:\n', status);
}
```

## [Pull Changes](docs/vcs/vcs.pullChanges.md)

Update your local repository by fetching and merging from its remote. Use it to sync before pushing, after switching branches, or as part of a “safe sync” flow. It returns a success flag and an optional error message.

Example: pull latest changes and notify the user.

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

## [Push Changes](docs/vcs/vcs.pushChanges.md)

Publish committed work from your local repository to its remote. This wraps the editor’s VCS integration, so it works across providers. Use it after committing, often paired with pull (to avoid non‑fast‑forward errors) and status checks.

Example: push committed changes (optionally scoping to a specific repo path).

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