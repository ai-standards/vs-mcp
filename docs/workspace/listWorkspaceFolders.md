# workspace.listWorkspaceFolders

List Workspace Folders returns the absolute paths of all folders in the current VS Code workspace. It works for single-folder projects and multi-root workspaces.

You’ll use this when you need a starting point for any workspace-scoped operation: pick a project root, iterate monorepo packages, or guard other tools that require a workspace path.

## What it does

- Returns a list of absolute folder paths currently added to the workspace.
- Supports multi-root workspaces (in order as shown in VS Code).

## Why you might need it

- Select a folder to operate on (open a file, run a command, or write outputs).
- Iterate all roots in a monorepo and perform per-folder actions.
- Fail fast with a clear message if no workspace is open.

## Signature

- Namespace: **workspace**
- Tool ID: **listWorkspaceFolders**
- Description: List all workspace folders.

Inputs:
- None

Outputs:
- folders: string[] (required) — absolute folder paths.

## Basic usage

```javascript
// You have: mcp (client), server (MCP server), and scope (optional file path)
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {}, { server, scope });

if (!folders.length) {
  console.warn('No workspace folders found.');
} else {
  console.log('Workspace folders:', folders);
}
```

## Examples

### Show the folders in a message

Display the list so the user sees exactly what the tool found.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {}, { server, scope });

if (!folders.length) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: 'No workspace folders found. Open a folder or multi-root workspace and try again.'
  }, { server, scope });
} else {
  await mcp.dispatch('ui.showInfoMessage', {
    message: `Workspace folders:\n${folders.map((f, i) => `${i + 1}. ${f}`).join('\n')}`
  }, { server, scope });
}
```

### Let the user choose a folder by index

Prompt for a number, then use it to build an absolute file path and open it.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {}, { server, scope });
if (!folders.length) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: 'No workspace folders available.'
  }, { server, scope });
  return;
}

// Show a simple numbered list for the user to pick from
const list = folders.map((f, i) => `${i + 1}. ${f}`).join('\n');
await mcp.dispatch('ui.showInfoMessage', { message: `Folders:\n${list}` }, { server, scope });

const { value: rawIndex } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Enter the folder number to open README.md'
}, { server, scope });

// If user cancelled, rawIndex will likely be null/undefined; treat as abort
if (!rawIndex) return;

const idx = Number(rawIndex) - 1;
const chosen = folders[idx];

if (!chosen || Number.isNaN(idx)) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: 'Invalid selection.'
  }, { server, scope });
  return;
}

// Try to open README.md in the chosen folder (absolute path)
const readmePath = `${chosen}/README.md`;
await mcp.dispatch('editor.openFile', { path: readmePath }, { server, scope });
```

### Guard other workspace tools with a fast check

Use the folder list to decide whether it’s safe to proceed with workspace-aware actions (e.g., listing files).

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {}, { server, scope });
if (!folders.length) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: 'No workspace open. Cannot continue.'
  }, { server, scope });
  return;
}

// Safe to use other workspace tools now
const { files } = await mcp.dispatch('workspace.listWorkspaceFiles', {
  glob: '**/package.json'
}, { server, scope });

await mcp.dispatch('ui.showInfoMessage', {
  message: `Found ${files.length} package.json files across ${folders.length} workspace folder(s).`
}, { server, scope });
```

### Run a command in each folder (per-folder terminals)

Create one terminal per folder and execute a command (e.g., list files). Useful in monorepos.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {}, { server, scope });
if (!folders.length) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: 'No workspace folders available.'
  }, { server, scope });
  return;
}

for (const folder of folders) {
  const name = `ws:${folder.split('/').pop() || folder}`;
  const { terminalId } = await mcp.dispatch('terminal.createTerminal', { name }, { server, scope });

  // Send a command; adjust for your shell as needed
  await mcp.dispatch('terminal.sendTextToTerminal', {
    terminalId,
    text: `echo "Folder: ${folder}" && ls -la "${folder}"`
  }, { server, scope });

  await mcp.dispatch('terminal.showTerminal', { terminalId }, { server, scope });
}
```

### Quick filter: pick folders by substring, then act

A simple in-memory filter without extra filesystem calls.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {}, { server, scope });
if (!folders.length) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: 'No workspace folders available.'
  }, { server, scope });
  return;
}

const { value: needle } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Filter folders by substring (e.g., "packages")'
}, { server, scope });

if (!needle) return;

const filtered = folders.filter(f => f.toLowerCase().includes(needle.toLowerCase()));

if (!filtered.length) {
  await mcp.dispatch('ui.showInfoMessage', { message: 'No matches.' }, { server, scope });
  return;
}

await mcp.dispatch('ui.showInfoMessage', {
  message: `Matched folders:\n${filtered.map((f, i) => `${i + 1}. ${f}`).join('\n')}`
}, { server, scope });
```

## Notes and tips

- The tool returns absolute paths. Use them directly with editor.openFile and terminal commands.
- Multi-root workspaces preserve the order you see in VS Code.
- If there are no folders, handle it explicitly. Many other tools assume a workspace exists.
- Path joining in examples uses simple string concatenation for clarity. If you need robust cross-platform joining, normalize your inputs or implement a small helper before concatenation.