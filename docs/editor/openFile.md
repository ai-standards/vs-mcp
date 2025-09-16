# Open File By Path (editor.openFile)

Open any file in VS Code by absolute path. That’s it—no prompts, no guesses. You point at a path; the editor opens it.

Use this when you already know the file you want, or when other tools have resolved a path for you. It’s a glue tool that pairs well with workspace and filesystem tools to turn relative or searched paths into an absolute target.

## Quick start

Open a file by providing an absolute path. The tool returns a simple acknowledgment.

```javascript
const { ok } = await mcp.dispatch('editor.openFile', {
  path: '/Users/alex/projects/app/src/index.ts'
});
```

## Variations

### Open a workspace file by relative path

If you have a workspace-relative path, resolve it to absolute via the first workspace folder.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
if (!folders.length) {
  await mcp.dispatch('ui.showWarningMessage', { message: 'No workspace is open.' });
} else {
  const root = folders[0].replace(/[/\\]$/, '');
  const relative = 'src/index.ts';
  const absolute = `${root}/${relative}`.replace(/\\/g, '/');

  const { ok } = await mcp.dispatch('editor.openFile', { path: absolute });
}
```

### Prompt the user, search, then open the best match

Ask for a filename (or fragment), search the workspace, and open the first match.

```javascript
const { value: query } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Filename (or fragment) to open, e.g., index.ts'
});

if (query) {
  const glob = `**/*${query}*`;
  const { files } = await mcp.dispatch('fs.findFiles', { glob, maxResults: 50 });

  if (!files.length) {
    await mcp.dispatch('ui.showInfoMessage', { message: `No matches for "${query}".` });
  } else {
    const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
    const root = folders[0]?.replace(/[/\\]$/, '') || '';
    const candidate = files[0].replace(/^[/\\]/, '');
    const absolute = `${root}/${candidate}`.replace(/\\/g, '/');

    await mcp.dispatch('editor.openFile', { path: absolute });
  }
}
```

### Open a file next to the current scope

Use the current file’s directory (scope) to open a sibling.

```javascript
if (scope) {
  const dir = scope.replace(/\\/g, '/').replace(/\/[^/]*$/, '');
  const absolute = `${dir}/types.ts`;

  await mcp.dispatch('editor.openFile', { path: absolute });
}
```

### Create a file, then open it

Create a file in the workspace and immediately bring it into the editor.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
if (folders.length) {
  const root = folders[0].replace(/[/\\]$/, '');
  const relative = 'notes/today.md';
  const absolute = `${root}/${relative}`;

  await mcp.dispatch('workspace.createWorkspaceFile', {
    path: relative,
    content: '# Notes\n'
  });

  await mcp.dispatch('editor.openFile', { path: absolute });
}
```

### Handle failures cleanly

Wrap the call to surface useful feedback.

```javascript
try {
  const result = await mcp.dispatch('editor.openFile', {
    path: '/not/a/real/path.txt'
  });

  if (!result || result.ok === false) {
    throw new Error('Open failed.');
  }
} catch (err) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Could not open file: ${String(err)}`
  });
}
```

## Tips

- The path must be absolute. Combine with workspace tools to resolve relative paths.
- Normalize slashes when building paths (`replace(/\\/g, '/')`) to avoid separator issues.
- For non-file content, use editor.openVirtual to open a read-only virtual document.

## Tool signature

Exact definition from the extension:

```json
{"id":"openFile","name":"Open File By Path","path":"src/tools/editor/open-file.mcpx.ts","namespace":"editor","description":"Open a file in the editor by absolute path.","input":{"path":{"type":"string","required":true}},"output":{"ok":{"type":"false","required":true}}}
```