# workspace.renameWorkspaceFolder

Rename Workspace Folder uses VS Code’s FileSystem API to rename a folder inside your workspace. Because it goes through VS Code, permissions and file metadata are preserved, and the UI stays in sync.

You’ll reach for this tool when a package or module grows beyond its name, or when you’re consolidating directories in a monorepo. It’s safer than shelling out, and it integrates cleanly with other vs-mcp tools.

- Uses VS Code’s [FileSystem API](https://code.visualstudio.com/api/references/vscode-api#FileSystem).
- Works on folders inside the current workspace.
- Returns a success flag and an optional error string so you can compose it with other tools (status, UI prompts, VCS, etc.).

## Inputs and Outputs

- Input:
  - oldPath: string (required) — the existing folder path (absolute or workspace-relative).
  - newPath: string (required) — the desired destination path (absolute or workspace-relative).
- Output:
  - success: boolean
  - error?: string

Example I/O shape:

```json
{
  "input": { "oldPath": "packages/utils", "newPath": "packages/shared-utils" },
  "output": { "success": true, "error": "" }
}
```

Tip: Pass a fully qualified newPath (including the new folder name). The tool does not create missing intermediate directories.

## Basic usage

Rename a folder from src/legacy to src/core.

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

## Variations

### Prompt the user for paths

Ask for the source and destination, then rename. This keeps renames explicit and auditable.

```javascript
// mcp, server, scope are available

const { value: from } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Folder to rename (e.g., packages/utils)'
});
if (!from) return;

const { value: to } = await mcp.dispatch('ui.showInputBox', {
  prompt: `New folder path (e.g., packages/shared-utils)`
});
if (!to) return;

const { success, error } = await mcp.dispatch('workspace.renameWorkspaceFolder', {
  oldPath: String(from),
  newPath: String(to)
});

if (!success) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Could not rename "${from}" -> "${to}". ${error ?? ''}`
  });
}
```

### Keep the same parent directory, change only the name

Compute the destination path by replacing the last segment. No external libs required.

```javascript
// mcp, server, scope are available

const oldPath = 'packages/utils';
const newName = 'shared-utils';

// crude, cross-platform-ish parent extraction without Node's "path"
const lastSlash = Math.max(oldPath.lastIndexOf('/'), oldPath.lastIndexOf('\\'));
const parent = lastSlash >= 0 ? oldPath.slice(0, lastSlash) : '';
const newPath = parent ? `${parent}/${newName}` : newName;

const { success, error } = await mcp.dispatch('workspace.renameWorkspaceFolder', {
  oldPath,
  newPath
});

if (!success) console.error(error);
```

### Use absolute paths with the workspace root

If your flow prefers absolute paths, resolve the root from the workspace first.

```javascript
// mcp, server, scope are available

const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
if (!folders.length) throw new Error('No workspace folders found');

const workspaceRoot = folders[0]; // pick the one you want
const oldPath = `${workspaceRoot}/packages/utils`;
const newPath = `${workspaceRoot}/packages/shared-utils`;

const { success, error } = await mcp.dispatch('workspace.renameWorkspaceFolder', {
  oldPath,
  newPath
});

if (!success) console.error(error);
```

### Validate existence and avoid collisions

Check that the source exists and destination does not, then rename with a status indicator.

```javascript
// mcp, server, scope are available

async function dirExists(dir, workspaceRoot) {
  try {
    await mcp.dispatch('fs.readDir', { dir, workspaceRoot });
    return true;
  } catch {
    return false;
  }
}

const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
if (!folders.length) throw new Error('No workspace folders found');
const root = folders[0];

const from = `${root}/packages/utils`;
const to = `${root}/packages/shared-utils`;

if (!(await dirExists(from, root))) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Source folder does not exist: ${from}`
  });
  return;
}
if (await dirExists(to, root)) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Destination already exists: ${to}`
  });
  return;
}

await mcp.dispatch('status.showStatusBar', {
  id: 'rename-folder',
  message: `Renaming: ${from} → ${to}`,
  spinner: true
});

const { success, error } = await mcp.dispatch('workspace.renameWorkspaceFolder', {
  oldPath: from,
  newPath: to
});

await mcp.dispatch('status.dismissStatus', { id: 'rename-folder' });

if (!success) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Rename failed: ${error ?? 'Unknown error'}`
  });
}
```

### Batch rename multiple folders and commit the change

When reorganizing a monorepo, apply multiple renames and then commit with a single message.

```javascript
// mcp, server, scope are available

const renames = [
  ['packages/utils', 'packages/shared-utils'],
  ['packages/api', 'packages/core-api']
];

const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
if (!folders.length) throw new Error('No workspace folders found');
const root = folders[0];

for (const [fromRel, toRel] of renames) {
  const from = `${root}/${fromRel}`;
  const to = `${root}/${toRel}`;

  const { success, error } = await mcp.dispatch('workspace.renameWorkspaceFolder', {
    oldPath: from,
    newPath: to
  });

  if (!success) {
    console.error(`Rename failed: ${fromRel} -> ${toRel}`, error);
    // choose: break or continue
  }
}

// Commit the reorg (any VCS provider)
const commit = await mcp.dispatch('vcs.commitChanges', {
  message: 'chore(repo): rename packages'
});
if (!commit.success) console.error('Commit failed:', commit.error);
```

## Behavior and constraints

- Works only inside the current workspace.
- Does not overwrite existing destinations. Ensure the target folder doesn’t exist.
- Expects full destination paths (including the new folder name).
- Does not create intermediate directories.
- Uses VS Code’s file system API, preserving security permissions and playing nicely with the editor and explorers.

## When to choose this tool

- You want renames that are editor-aware and safe for permissions.
- You want to compose renames with prompts, status, and VCS actions using a consistent MCP flow.
- You care about reliability across platforms and avoiding ad-hoc shell commands.