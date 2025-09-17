# workspace.createWorkspaceFile

Create a new file in the current VS Code workspace, optionally seeding it with content. It’s the quickest way to scaffold files from code: generate a README, drop a config stub, or spin up a new module next to the file you’re editing.

Use it when you want a predictable, workspace-aware file create operation without dipping into Node APIs. You give it a path (workspace-relative), maybe a string of text, and it does the rest.

## What it does

- Creates a file in the workspace at the path you provide.
- Optionally writes initial UTF-8 content.
- Returns a success flag and an optional error string.

If the parent folder doesn’t exist or the file cannot be created, you’ll get a failure response with an error message.

## Dispatch signature

```javascript
const { success, error } = await mcp.dispatch('workspace.createWorkspaceFile', {
  path,     // string (required) — workspace-relative path
  content,  // string (optional) — initial file contents
});
```

- Input
  - path: string (required)
  - content: string (optional)
- Output
  - success: boolean
  - error?: string

Note: Paths are expected to be workspace-relative. Avoid absolute paths outside the workspace.

## Basic usage

Create a file with initial content.

```javascript
const { success, error } = await mcp.dispatch('workspace.createWorkspaceFile', {
  path: 'src/index.ts',
  content: `export const main = () => console.log('hello');\n`,
});

if (!success) {
  throw new Error(error || 'Failed to create file');
}
```

## Variations

### Create an empty file

If you omit content, the tool creates an empty file.

```javascript
const { success, error } = await mcp.dispatch('workspace.createWorkspaceFile', {
  path: 'docs/CHANGELOG.md',
});

if (!success) {
  throw new Error(error || 'Failed to create empty file');
}
```

### Create a file next to the current scope

Often you want a sibling file to the one you’re working on. scope is a filepath (optional). This snippet derives the directory from scope without Node helpers.

```javascript
// scope is a filepath string like "src/features/user/profile.ts" (may be undefined)
const baseDir = scope ? scope.split('/').slice(0, -1).join('/') : 'src';
const filePath = `${baseDir}/profile.test.ts`;

const { success, error } = await mcp.dispatch('workspace.createWorkspaceFile', {
  path: filePath,
  content: `import { describe, it, expect } from 'vitest';\n\ndescribe('profile', () => {\n  it('works', () => {\n    expect(true).toBe(true);\n  });\n});\n`,
});

if (!success) {
  throw new Error(error || `Failed to create ${filePath}`);
}
```

### Prompt the user for the path and initial content

Combine with ui.showInputBox to keep users in control.

```javascript
const { value: pathInput } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'New file path (workspace-relative):',
  placeHolder: 'e.g. src/utils/logger.ts',
});

if (!pathInput) throw new Error('No file path provided');

const { value: contentInput } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Initial content (optional):',
  placeHolder: '// leave empty for a blank file',
});

const { success, error } = await mcp.dispatch('workspace.createWorkspaceFile', {
  path: pathInput,
  content: contentInput || '',
});

if (!success) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Could not create ${pathInput}: ${error || 'unknown error'}`,
  });
}
```

### Create the file if missing, then open it

Check for existence using workspace.listWorkspaceFiles and open the file once created.

```javascript
const target = 'README.md';

// a simple existence check via glob match
const { files } = await mcp.dispatch('workspace.listWorkspaceFiles', {
  glob: target, // exact filename at workspace root
});

if (files.includes(target)) {
  await mcp.dispatch('ui.showInfoMessage', { message: `${target} already exists.` });
} else {
  const { success, error } = await mcp.dispatch('workspace.createWorkspaceFile', {
    path: target,
    content: `# Project\n\nDescribe your project here.\n`,
  });

  if (!success) throw new Error(error || `Failed to create ${target}`);
}

await mcp.dispatch('editor.openFile', { path: target });
```

### Batch scaffold multiple files

Loop through a set of files and create each, reporting failures succinctly.

```javascript
const filesToCreate = [
  { path: 'src/app.ts', content: `export function app() {}\n` },
  { path: 'src/app.test.ts', content: `import { app } from './app';\n` },
  { path: 'src/types.d.ts', content: `// shared types\n` },
];

for (const file of filesToCreate) {
  const { success, error } = await mcp.dispatch('workspace.createWorkspaceFile', file);
  if (!success) {
    await mcp.dispatch('showWarningMessage', { // note: correct tool is ui.showWarningMessage
      message: `Failed to create ${file.path}: ${error || 'unknown error'}`,
    });
  }
}
```

Correcting the warning call to use the UI namespace:

```javascript
for (const file of filesToCreate) {
  const { success, error } = await mcp.dispatch('workspace.createWorkspaceFile', file);
  if (!success) {
    await mcp.dispatch('ui.showWarningMessage', {
      message: `Failed to create ${file.path}: ${error || 'unknown error'}`,
    });
  }
}
```

## Practical notes

- Ensure parent folders exist before creating the file. If the directory is missing, the operation may fail.
- Treat content as UTF-8 text.
- To avoid accidental overwrites, check existence first with workspace.listWorkspaceFiles.
- To immediately work with the file, follow up with editor.openFile.

## See also

- List workspace files: workspace.listWorkspaceFiles
- Delete a file: workspace.deleteWorkspaceFile
- Open a file in the editor: editor.openFile
- Prompt for user input: ui.showInputBox
- Show messages: ui.showInfoMessage, ui.showWarningMessage