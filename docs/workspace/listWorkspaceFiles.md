# workspace.listWorkspaceFiles — List Files in Your Workspace

The workspace.listWorkspaceFiles tool scans your workspace and returns file paths that match a glob pattern. It’s a fast way to answer questions like “What .ts files live under src?” or “Show me all test files next to this file.”

Use it to build file pickers, batch operations, or to feed other tools (open editors, read file contents, generate tests). You control the search with a single optional glob.

Glob patterns follow common conventions (e.g., **, *.js, folder/**/*.ts). For VS Code’s definition, see [GlobPattern](https://code.visualstudio.com/api/references/vscode-api#GlobPattern).

## What it does

- Searches the current workspace.
- Optionally filters with a glob.
- Returns an array of matching file paths.

## Why you might need it

- Drive bulk tasks (read, refactor, delete) across matching files.
- Quickly locate files to open or inspect.
- Build workflows that chain with other tools (editor, fs, ai).

## Tool signature

- Namespace: workspace
- Id: listWorkspaceFiles
- Description: List files in the workspace matching a glob pattern.
- Input:
  - glob: string (optional)
- Output:
  - files: string[] (required)

## Basic usage

List every file in the workspace. If your workspace is large, consider narrowing with a glob.

```javascript
// Assume `mcp`, `server`, and optional `scope` are available.
const { files } = await mcp.dispatch('workspace.listWorkspaceFiles', {
  // omit `glob` to list everything
});

console.log(`Found ${files.length} files`);
```

## Variations

### Filter by glob

Use a glob to limit results. Common patterns:
- "**/*.ts" — all TypeScript files
- "src/**/*.test.*" — tests anywhere under src
- "docs/**/*.md" — markdown docs

```javascript
// Assume `mcp`, `server`, and optional `scope` are available.
const { files } = await mcp.dispatch('workspace.listWorkspaceFiles', {
  glob: 'src/**/*.ts'
});

console.log(files);
```

### Prompt the user for a glob

Let the user decide the pattern at runtime.

```javascript
// Assume `mcp`, `server`, and optional `scope` are available.
const { value: glob } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Enter a glob (e.g., **/*.ts, src/**/*.test.*)'
});

const { files } = await mcp.dispatch('workspace.listWorkspaceFiles', { glob: glob || '**/*' });

await mcp.dispatch('ui.showInfoMessage', {
  message: `Matched ${files.length} file(s)`
});
```

### Search near the current file using scope

If scope is a file path, narrow to its directory. This keeps the example vanilla without Node path utilities.

```javascript
// Assume `mcp`, `server`, and optional `scope` are available.
// Derive the directory from `scope` (if it's a file path).
const baseDir = scope && scope.includes('/')
  ? scope.replace(/\/[^/]*$/, '/')  // strip trailing filename
  : (scope || '');                   // or use scope as-is if it's already a folder

const { files } = await mcp.dispatch('workspace.listWorkspaceFiles', {
  glob: `${baseDir}**/*.test.*`
});

console.log(files);
```

### Open the first match in the editor

Combine with editor.openFile to jump straight to a file.

```javascript
// Assume `mcp`, `server`, and optional `scope` are available.
const { files } = await mcp.dispatch('workspace.listWorkspaceFiles', {
  glob: 'src/**/*.ts'
});

if (files.length > 0) {
  await mcp.dispatch('editor.openFile', { path: files[0] });
} else {
  await mcp.dispatch('ui.showInfoMessage', { message: 'No matches found.' });
}
```

### Read the contents of all matches

Use workspace.listWorkspaceFolders to get a root, then fs.readFile for each path.

```javascript
// Assume `mcp`, `server`, and optional `scope` are available.
const { files } = await mcp.dispatch('workspace.listWorkspaceFiles', {
  glob: 'docs/**/*.md'
});

const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = folders[0];

for (const path of files) {
  const { text } = await mcp.dispatch('fs.readFile', { path, workspaceRoot });
  console.log(`--- ${path} ---`);
  console.log(text.slice(0, 200)); // preview
}
```

### Bulk delete matching files (with confirmation)

Be careful. Always confirm before destructive actions.

```javascript
// Assume `mcp`, `server`, and optional `scope` are available.
const { files } = await mcp.dispatch('workspace.listWorkspaceFiles', {
  glob: 'dist/**/*'
});

if (files.length === 0) {
  await mcp.dispatch('ui.showInfoMessage', { message: 'Nothing to delete.' });
} else {
  const { choice } = await mcp.dispatch('ui.showWarningMessage', {
    message: `Delete ${files.length} generated file(s) under dist/?`,
    actions: ['Delete', 'Cancel']
  });

  if (choice === 'Delete') {
    for (const path of files) {
      await mcp.dispatch('workspace.deleteWorkspaceFile', { path });
    }
    await mcp.dispatch('ui.showInfoMessage', { message: 'Deletion complete.' });
  }
}
```

## Tips and caveats

- Glob omission returns all files. On large workspaces, prefer a specific glob.
- Need a hard cap on results? Consider fs.findFiles, which supports maxResults, when that suits your workflow.
- Returned paths are suitable for other workspace/editor tools. If a tool requires workspaceRoot, fetch it via workspace.listWorkspaceFolders.
- Patterns are workspace-relative. Prefix with a folder (e.g., src/**) to scope your search quickly.

## Related tools

- workspace.listWorkspaceFolders — enumerate workspace roots to build root-aware file flows.
- editor.openFile — open a file by absolute path.
- fs.readFile — read file contents (requires workspaceRoot).
- workspace.deleteWorkspaceFile — remove a file.
- fs.findFiles — like this tool, but supports maxResults if you need result limits.