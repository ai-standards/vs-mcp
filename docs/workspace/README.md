# workspace — Workspace-aware file and folder operations

The workspace namespace provides safe, editor-aware tools for working with files and folders inside your current VS Code workspace. Use these when you want predictable behavior that plays nicely with VS Code’s UI, permissions, and multi-root setups—without reaching into Node APIs.

Reach for workspace tools to list files, scaffold new ones, clean up generated artifacts, or reorganize directories. They compose cleanly with other vs-mcp tools like ui (prompts and messages), editor (open files), status (progress), fs (low-level file access), and vcs (commit changes). Paths are typically workspace-relative, which keeps scripts portable across machines and collaborators.

Common patterns:
- Discover files with a glob, then open or modify them.
- Create or delete files as part of setup/cleanup tasks.
- Inspect workspace roots before running bulk operations.
- Rename a folder using VS Code’s FileSystem for a smooth, safe change.

## [workspace.createWorkspaceFile](docs/workspace/createWorkspaceFile.md)

Create a new file in the current VS Code workspace, optionally seeding it with content. It’s the quickest way to scaffold files from code: generate a README, drop a config stub, or spin up a new module next to the file you’re editing.

Use it when you want a predictable, workspace-aware file create operation without dipping into Node APIs. You give it a path (workspace-relative), maybe a string of text, and it does the rest.

Basic example

```javascript
const { success, error } = await mcp.dispatch('workspace.createWorkspaceFile', {
  path: 'src/index.ts',
  content: `export const main = () => console.log('hello');\n`,
});

if (!success) {
  throw new Error(error || 'Failed to create file');
}
```

## [workspace.deleteWorkspaceFile](docs/workspace/deleteWorkspaceFile.md)

Delete a file from your current VS Code workspace. It’s the fast, scriptable way to clean up generated artifacts, remove obsolete modules, or tidy temporary files without leaving your editor. Accepts a path (workspace-relative or absolute) and returns a success flag and optional error message.

Basic example

```javascript
// You have: mcp (client), server (MCP server), and scope (optional filepath) in context.
const { success, error } = await mcp.dispatch('workspace.deleteWorkspaceFile', {
  path: 'dist/output.log'
});

if (!success) {
  console.error('Failed to delete file:', error);
}
```

## [workspace.listWorkspaceFiles](docs/workspace/listWorkspaceFiles.md)

Scan your workspace and return file paths that match an optional glob pattern. Great for building file pickers, batch operations, or feeding other tools (open editors, read file contents, generate tests).

Basic example

```javascript
// Assume `mcp`, `server`, and optional `scope` are available.
const { files } = await mcp.dispatch('workspace.listWorkspaceFiles', {
  // omit `glob` to list everything
});

console.log(`Found ${files.length} files`);
```

## [workspace.listWorkspaceFolders](docs/workspace/listWorkspaceFolders.md)

Return the absolute paths of all folders in the current VS Code workspace. Works for single-folder projects and multi-root workspaces—useful as a starting point for any workspace-scoped operation.

Basic example

```javascript
// You have: mcp (client), server (MCP server), and scope (optional file path)
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {}, { server, scope });

if (!folders.length) {
  console.warn('No workspace folders found.');
} else {
  console.log('Workspace folders:', folders);
}
```

## [workspace.renameWorkspaceFolder](docs/workspace/renameWorkspaceFolder.md)

Rename a folder inside your workspace using VS Code’s FileSystem API. It’s safer than shelling out, preserves permissions and metadata, and keeps the editor UI in sync. Provide an oldPath and newPath (absolute or workspace-relative).

Basic example

```javascript
// mcp, server, scope are available

const { success, error } = await mcp.dispatch('workspace.renameWorkspaceFolder', {
  oldPath: 'src/legacy',
  newPath: 'src/core'
});

if (!success) {
  console.error('Rename failed:', error);
}
```