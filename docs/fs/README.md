# Workspace file system tools

The fs MCPs gives you safe, workspace-scoped file operations for vs-mcp. Use these tools to discover files by pattern, list directories, read UTF‑8 text, and write files—without leaving the boundaries of the active workspace. They’re designed to compose: find → read → transform → write, and to pair naturally with UI, editor, and workspace tools.

You’ll use fs when you need to inventory files, build pickers and navigators, inspect or generate content, and automate refactors or scaffolding. Most outputs are workspace-relative paths; when absolute roots are required, combine with workspace.listWorkspaceFolders.

## [fs.findFiles](docs/fs/findFiles.md)

Find files by glob pattern within the workspace. It’s fast, workspace-aware, and returns clean, workspace‑relative paths you can feed into other tools.

Example (find Markdown files anywhere):

```javascript
// given: mcp, mcpServer, scope (optional filepath)

const { files } = await mcp.dispatch('fs.findFiles', {
  glob: '**/*.md'
});

console.log(files); // ['README.md', 'docs/guide.md', ...]
```

## [fs.readDir](docs/fs/readDir.md)

List the immediate entries in a folder (names and kinds like file or directory), relative to a workspace root. Ideal for building pickers, navigators, and explicit directory walks.

Example (basic usage):

```javascript
// Resolve a workspace root (prefer scope if provided)
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = scope || folders[0];

// List entries inside the workspace root (".") or a subfolder (e.g., "src")
const { items } = await mcp.dispatch('fs.readDir', {
  dir: '.',
  workspaceRoot
});

for (const { name, type } of items) {
  console.log(`${type}\t${name}`);
}
```

## [fs.readFile](docs/fs/readFile.md)

Read a UTF‑8 file inside the workspace. Returns the file’s text plus echo metadata (path and workspaceRoot).

Example (basic usage):

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

## [fs.writeFile](docs/fs/writeFile.md)

Write a UTF‑8 file within the workspace. Creates new files and prompts for confirmation when overwriting existing ones.

Example (basic usage):

```javascript
// mcp, server, and optional scope are available

// 1) Pick a workspace root (first folder)
const { folders } = await mcp.dispatch('workspace.listFolders', {});
if (!folders || folders.length === 0) {
  throw new Error('Open a workspace folder before writing files.');
}
const workspaceRoot = folders[0];

// 2) Write a file
const result = await mcp.dispatch('fs.writeFile', {
  path: 'notes/todo.md',
  content: '# TODO\n- Write docs\n- Ship it\n',
  workspaceRoot
});

// 3) Inspect the result
const { ok, path } = result;
console.log(`Write ${ok ? 'succeeded' : 'did not complete'} for ${path}`);
```