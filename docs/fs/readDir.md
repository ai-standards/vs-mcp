# fs.readDir — Read Directory

Read Directory lists the immediate entries in a folder inside your workspace. It returns each entry’s name and kind so you can quickly build pickers, navigators, and file workflows without touching Node’s fs APIs.

Use it when you want a safe, workspace-aware listing of a directory. It pairs well with ui tools (to prompt the user), editor tools (to display results), and other fs tools (to read or write files discovered here).

- Namespace: fs
- Tool ID: readDir
- Description: List directory entries (name + kind).

## Inputs and outputs

- Input
  - dir (string, required): Path to list, typically workspace-relative (e.g., ".", "src", "docs/api").
  - workspaceRoot (string, required): Absolute path to the workspace folder you want to anchor to.

- Output
  - dir (string): Echo of the input dir.
  - workspaceRoot (string): Echo of the input workspaceRoot.
  - items ({ name: string; type: string; }[]): Entries in the directory. type is typically "file" or "directory" (may include others like "symlink" depending on the environment).

Tip: If you don’t know the workspace root at runtime, query it first with workspace.listWorkspaceFolders.

## Basic usage

List the contents of a folder relative to the current workspace. In all examples, assume you have mcp, server, and scope (optional filepath) available.

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

## Prompt the user for a folder

Let the user type which directory to list. This keeps the flow interactive and flexible.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = scope || folders[0];

const { value: dirInput } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Which folder (workspace-relative) do you want to list?',
  placeHolder: 'e.g., ., src, packages/app'
});

const dir = dirInput || '.';

const { items } = await mcp.dispatch('fs.readDir', { dir, workspaceRoot });

// Show results in a read-only virtual document
const lines = items.map(({ name, type }) => `${type}\t${name}`).join('\n');

await mcp.dispatch('editor.openVirtual', {
  content: `Directory: ${dir}\n${lines}`,
  language: 'text'
});
```

## Filter files vs. directories

The output tells you what each entry is. Filter to build focused views.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = scope || folders[0];

const { items } = await mcp.dispatch('fs.readDir', {
  dir: 'src',
  workspaceRoot
});

const onlyDirs = items.filter(e => e.type === 'directory');
const onlyFiles = items.filter(e => e.type === 'file');

console.log('Directories:', onlyDirs.map(e => e.name));
console.log('Files:', onlyFiles.map(e => e.name));
```

## Recursively walk a directory tree

fs.readDir is single-level by design. To walk a tree, compose it recursively.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = scope || folders[0];

async function walk(dir) {
  const seen = [];

  async function dfs(currentDir) {
    const { items } = await mcp.dispatch('fs.readDir', {
      dir: currentDir,
      workspaceRoot
    });

    for (const entry of items) {
      const path = currentDir === '.' ? entry.name : `${currentDir}/${entry.name}`;
      seen.push({ path, type: entry.type });
      if (entry.type === 'directory') {
        await dfs(path);
      }
    }
  }

  await dfs(dir);
  return seen;
}

const all = await walk('.');
console.log(all.map(e => `${e.type}\t${e.path}`).join('\n'));
```

## Combine with reading file contents

List a folder, pick a file, then read it.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = scope || folders[0];

const { items } = await mcp.dispatch('fs.readDir', {
  dir: 'src',
  workspaceRoot
});

const files = items.filter(e => e.type === 'file');
if (files.length === 0) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: 'No files found in src'
  });
} else {
  const first = files[0].name;
  const { text } = await mcp.dispatch('fs.readFile', {
    path: `src/${first}`,
    workspaceRoot
  });

  await mcp.dispatch('editor.openVirtual', {
    content: `// src/${first}\n\n${text}`,
    language: 'typescript'
  });
}
```

## Handle errors gracefully

Wrap calls in try/catch to surface actionable messages to the user.

```javascript
try {
  const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
  const workspaceRoot = scope || folders[0];

  const { items } = await mcp.dispatch('fs.readDir', {
    dir: 'non-existent-folder',
    workspaceRoot
  });

  console.log(items);
} catch (err) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Failed to read directory: ${err?.message || String(err)}`
  });
}
```

## Practical notes

- dir is evaluated relative to workspaceRoot. Use "." to list the root.
- entries do not include special values like "." or "..".
- type is commonly "file" or "directory". Depending on the environment, you may see other kinds (e.g., "symlink").
- If you need pattern-based search across the workspace, prefer fs.find. Use fs.readDir when you want precise, single-level listings and explicit traversal.