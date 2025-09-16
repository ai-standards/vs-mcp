# fs.readFile — Read File

Read a UTF‑8 file from your VS Code workspace, fast and safely. The fs.readFile tool gives you the file’s text content along with echo metadata (the path and workspace root you requested).

Use it when you need to inspect a file, pipe its content into another tool, or build higher-level flows like “find → read → transform → propose edits.” It does one thing well: read workspace files (UTF‑8) reliably.

- Namespace: **fs**
- Tool id: **readFile**
- Description: Read a UTF‑8 file inside the workspace.
- Input:
  - **path** (string, required): File path relative to the workspace root.
  - **workspaceRoot** (string, required): Absolute path of the workspace root folder.
- Output:
  - **path** (string)
  - **workspaceRoot** (string)
  - **text** (string): File content (UTF‑8)

Note: All examples assume you already have:
- an MCP client instance: `mcp`
- the MCP server: `server`
- an optional `scope` variable representing a file path (absolute or workspace-relative)

All calls use `mcp.dispatch(...)`.

## Basic usage

Read a specific file (optionally using `scope` if provided), using the first workspace folder as `workspaceRoot`.

```javascript
// Get a workspace root via the workspace tool.
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
if (!folders || folders.length === 0) {
  throw new Error('No workspace folders found.');
}
const workspaceRoot = folders[0];

// Choose a path: prefer "scope" if provided; otherwise use a default.
const path = (typeof scope === 'string' && scope) ? scope : 'README.md';

// If scope is absolute, convert to workspace-relative.
const toWorkspaceRelative = (abs, root) => abs.startsWith(root + '/') ? abs.slice(root.length + 1) : abs;
const relPath = path.startsWith('/') ? toWorkspaceRelative(path, workspaceRoot) : path;

// Read the file.
const { text } = await mcp.dispatch('fs.readFile', { path: relPath, workspaceRoot });

// Use the content.
console.log(`Read ${relPath}:\n`, text.slice(0, 200), '...');
```

## Prompt for a path at runtime

Let the user type a relative path, then fetch the content.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
if (!folders?.length) throw new Error('No workspace folders.');
const workspaceRoot = folders[0];

const { value: inputPath } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Enter a workspace-relative file path to read (e.g., src/index.ts)'
});

if (!inputPath) {
  await mcp.dispatch('ui.showInfoMessage', { message: 'No path entered.' });
} else {
  const { text } = await mcp.dispatch('fs.readFile', { path: inputPath, workspaceRoot });
  console.log(text);
}
```

## Read using a glob, then open the content in a virtual document

Find a file using globbing, read it, and display it in a read-only editor tab.

```javascript
// Pick a workspace root.
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
if (!folders?.length) throw new Error('No workspace folders.');
const workspaceRoot = folders[0];

// Find candidate files.
const { files } = await mcp.dispatch('fs.findFiles', { glob: 'docs/**/*.md', maxResults: 50 });

if (!files.length) {
  await mcp.dispatch('ui.showInfoMessage', { message: 'No matching files.' });
} else {
  // For simplicity, pick the first.
  const first = files[0]; // already workspace-relative

  const { text } = await mcp.dispatch('fs.readFile', { path: first, workspaceRoot });

  // Show it as a temporary, read-only document.
  await mcp.dispatch('editor.openVirtual', {
    content: text,
    language: 'markdown'
  });
}
```

## Read multiple files (batch)

Pipe a list of matches into parallel reads.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
if (!folders?.length) throw new Error('No workspace folders.');
const workspaceRoot = folders[0];

// Find all JSON files in config/.
const { files } = await mcp.dispatch('fs.findFiles', { glob: 'config/**/*.json' });

// Read them in parallel.
const results = await Promise.all(
  files.map(async (p) => {
    const { text } = await mcp.dispatch('fs.readFile', { path: p, workspaceRoot });
    return { path: p, text };
  })
);

// Use results.
for (const r of results) {
  console.log(`Read ${r.path} (${r.text.length} bytes)`);
}
```

## Use scope as a shortcut

If your flow passes a file path in `scope`, normalize it and read.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
if (!folders?.length) throw new Error('No workspace folders.');
const workspaceRoot = folders[0];

if (!scope || typeof scope !== 'string') {
  await mcp.dispatch('ui.showInfoMessage', { message: 'No scope path provided.' });
} else {
  const toWorkspaceRelative = (abs, root) => abs.startsWith(root + '/') ? abs.slice(root.length + 1) : abs;
  const path = scope.startsWith('/') ? toWorkspaceRelative(scope, workspaceRoot) : scope;

  const { text } = await mcp.dispatch('fs.readFile', { path, workspaceRoot });
  console.log(text);
}
```

## Robust error handling

Catch errors and surface them to the user.

```javascript
try {
  const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
  if (!folders?.length) throw new Error('No workspace folders.');
  const workspaceRoot = folders[0];

  const path = 'non-existent.txt';
  const { text } = await mcp.dispatch('fs.readFile', { path, workspaceRoot });
  console.log(text);
} catch (err) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Failed to read file: ${err?.message || String(err)}`
  });
}
```

## Notes and best practices

- The file must be inside the workspace; provide a valid workspace folder as **workspaceRoot** and a path relative to it.
- Content is read as **UTF‑8**.
- If the file does not exist or is not readable, the tool will throw; use try/catch.
- Prefer discovering the workspace root via `workspace.listWorkspaceFolders` rather than hardcoding paths.
- When you have an absolute path (e.g., from external context), convert it to a workspace-relative path before calling `fs.readFile`.

## Related tools

- [fs.findFiles](#): Find files by glob, then read them.
- [fs.readDir](#): Inspect directory contents before deciding what to read.
- [fs.writeFile](#): Write changes back (with confirmation).
- [editor.openVirtual](#): Display content in a read-only editor tab.
- [editor.proposeEdits](#): Show a diff and ask to apply changes to a file.