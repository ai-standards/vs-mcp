# workspace.deleteWorkspaceFile

Delete Workspace File removes a file from your current VS Code workspace. It’s the fast, scriptable way to clean up generated artifacts, remove obsolete modules, or tidy temporary files without leaving your editor.

You’ll use it when you want deletions to be predictable, repeatable, and safe to automate. It accepts a path (workspace-relative or absolute) and returns a success flag and an optional error message. That’s it—no surprises.

- Namespace: workspace
- Tool id: deleteWorkspaceFile
- Description: Delete a file from the workspace.

## I/O

- Input
  - path (string, required): The file path to delete. Prefer workspace-relative paths (e.g., src/utils/tmp.ts). Absolute paths inside the workspace are also accepted.
- Output
  - success (boolean): true when the file was deleted, false otherwise.
  - error (string, optional): Error detail when deletion fails (e.g., “file not found” or permission issues).

## Basic usage

Delete a specific file by path.

```javascript
// You have: mcp (client), server (MCP server), and scope (optional filepath) in context.
const { success, error } = await mcp.dispatch('workspace.deleteWorkspaceFile', {
  path: 'dist/output.log'
});

if (!success) {
  console.error('Failed to delete file:', error);
}
```

## Prompt for a path, then delete

Ask the user which file to delete. Useful when you don’t want to hardcode the path.

```javascript
// You have: mcp, server, scope (optional filepath).
const { value: target } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Enter the workspace-relative path to delete (e.g., src/old-module.ts)'
});

if (!target) {
  console.log('No path provided; nothing to delete.');
} else {
  const { success, error } = await mcp.dispatch('workspace.deleteWorkspaceFile', { path: target });
  if (!success) console.error('Delete failed:', error);
}
```

## Delete the active file (fallback to scope)

If scope is set to a file path, use it. Otherwise, grab the active editor file and delete it.

```javascript
// You have: mcp, server, scope.
let targetPath = scope;

if (!targetPath) {
  const active = await mcp.dispatch('editor.activeFile', {});
  // Expect active.path to be the absolute path of the current file.
  targetPath = active?.path;
}

if (!targetPath) {
  console.log('No active file to delete.');
} else {
  const { success, error } = await mcp.dispatch('workspace.deleteWorkspaceFile', { path: targetPath });
  if (!success) console.error('Delete failed:', error);
}
```

## Confirm before deleting

Add a guardrail: ask for confirmation, then delete.

```javascript
// You have: mcp, server, scope.
const target = scope || 'src/legacy/unused.ts';

const { choice } = await mcp.dispatch('ui.showWarningMessage', {
  message: `Delete file: ${target}?`,
  actions: ['Delete', 'Cancel']
});

if (choice !== 'Delete') {
  console.log('Deletion canceled.');
} else {
  const { success, error } = await mcp.dispatch('workspace.deleteWorkspaceFile', { path: target });
  if (!success) console.error('Delete failed:', error);
}
```

## Delete by glob: select, then delete

List matching files, let the user choose, then delete the selection.

```javascript
// You have: mcp, server, scope.
const { files } = await mcp.dispatch('workspace.listWorkspaceFiles', { glob: 'src/**/*.spec.ts' });

if (!files.length) {
  console.log('No files matched.');
} else {
  const { value: pick } = await mcp.dispatch('ui.showInputBox', {
    prompt: `Choose a file index to delete (0-${files.length - 1}):\n` + files.map((f, i) => `${i}: ${f}`).join('\n')
  });

  const idx = Number(pick);
  const chosen = Number.isInteger(idx) && files[idx] ? files[idx] : null;

  if (!chosen) {
    console.log('Invalid selection.');
  } else {
    const { success, error } = await mcp.dispatch('workspace.deleteWorkspaceFile', { path: chosen });
    if (!success) console.error('Delete failed:', error);
  }
}
```

## Batch delete (with a status indicator)

Delete many files that match a pattern, showing progress in the status bar.

```javascript
// You have: mcp, server, scope.
const glob = 'dist/**/*.map';
const { files } = await mcp.dispatch('workspace.listWorkspaceFiles', { glob });

await mcp.dispatch('status.showStatusBar', {
  id: 'batch-delete',
  message: `Deleting ${files.length} files…`,
  spinner: true
});

let failures = 0;

for (const path of files) {
  const { success } = await mcp.dispatch('workspace.deleteWorkspaceFile', { path });
  if (!success) failures++;
}

await mcp.dispatch('status.dismissStatus', { id: 'batch-delete' });

if (failures) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Deleted ${files.length - failures}/${files.length} files. Some deletions failed.`
  });
} else {
  await mcp.dispatch('status.showStatusWindow', {
    id: 'batch-delete-done',
    message: `Deleted ${files.length} files`
  });
}
```

## Defensive pattern: verify existence before delete

When you want a clearer error path, validate with a read attempt. If read fails, skip delete.

```javascript
// You have: mcp, server, scope.
const target = scope || 'README.old.md';

try {
  // If this throws or returns an error, the file likely doesn’t exist or is outside workspace root.
  // Provide your workspaceRoot as appropriate for your environment.
  const workspaceRoot = '/absolute/path/to/your/workspace';
  await mcp.dispatch('fs.readFile', { path: target, workspaceRoot });

  const { success, error } = await mcp.dispatch('workspace.deleteWorkspaceFile', { path: target });
  if (!success) console.error('Delete failed:', error);
} catch (e) {
  console.error('File not found or unreadable; skipping delete:', e?.message || e);
}
```

## Notes and best practices

- Prefer workspace-relative paths. They’re portable and safer.
- Use confirmation for destructive actions, especially if the path comes from user input.
- For large batches, consider chunking deletes and showing progress so users stay informed.
- Version control is your safety net. If the file is tracked, you can recover it after deletion via your VCS.
- Errors commonly indicate missing files, path outside the workspace, or permission issues. Always check the error field when success is false.