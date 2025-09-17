# fs.writeFile — Write a UTF‑8 file in your workspace

The fs.writeFile tool writes a UTF‑8 file inside the current workspace, with a confirmation step when needed. It’s your straightforward “persist this text to disk” primitive, but scoped safely to the workspace so you don’t accidentally scribble over files elsewhere.

Use it to save generated content, create starter files, snapshot intermediate results, or overwrite an existing file after a confirmation prompt.

- Writes text files (UTF‑8) only.
- Operates strictly within the workspace.
- Prompts for confirmation when overwriting.

## API

- Namespace: fs
- Tool id: writeFile
- Description: Write a UTF-8 file inside the workspace (with confirm).

Input
- path: string (required) — File path within the workspace (typically workspace‑relative).
- content: string (required) — Text to write.
- workspaceRoot: string (required) — The workspace folder root to bind the write under.

Output
- path: string — The path you asked to write.
- content: string — The content written.
- workspaceRoot: string — The workspace root used.
- ok: boolean — Whether the write completed (e.g., confirmed/applied).

Note: In all examples below, mcp, server, and scope (optional filepath) are available.

## Basic usage

Write a new file relative to the first workspace folder. If no workspace is open, we stop early.

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

## Variations

### Overwrite an existing file (with confirmation)

If the target file exists, fs.writeFile will ask for confirmation. Your code doesn’t need to handle the prompt; it receives the final status in ok.

```javascript
const { folders } = await mcp.dispatch('workspace.listFolders', {});
const workspaceRoot = folders[0];

const overwrite = await mcp.dispatch('fs.writeFile', {
  path: 'notes/todo.md',
  content: '# TODO\n- Replace with a new plan\n',
  workspaceRoot
});

if (!overwrite.ok) {
  console.warn('User declined overwrite or write did not complete.');
}
```

### Generate content, then write it

You can pipe AI‑generated text straight into a file.

```javascript
const { folders } = await mcp.dispatch('workspace.listFolders', {});
const workspaceRoot = folders[0];

// 1) Generate text
const { text } = await mcp.dispatch('ai.generateText', {
  prompt: 'Create a concise README for this project.',
  temperature: 0.2
});

// 2) Persist it
await mcp.dispatch('fs.writeFile', {
  path: 'README.md',
  content: text,
  workspaceRoot
});
```

### Write next to the current file (using scope)

When scope is available (e.g., the active file path), write a sibling file beside it.

```javascript
const { folders } = await mcp.dispatch('workspace.listFolders', {});
const workspaceRoot = folders[0];

// Derive a sibling path from scope if provided; otherwise, fall back
const siblingPath = (() => {
  if (!scope) return 'notes/from-scope.md';
  const normalized = scope.replace(/\\/g, '/');
  const parts = normalized.split('/');
  parts.pop(); // remove filename
  return `${parts.join('/')}/from-scope.md`;
})();

await mcp.dispatch('fs.writeFile', {
  path: siblingPath,
  content: 'Created next to the current file.',
  workspaceRoot
});
```

### Verify the write by reading the file back

Read immediately after writing to assert the content.

```javascript
const { folders } = await mcp.dispatch('workspace.listFolders', {});
const workspaceRoot = folders[0];

const path = 'tmp/check.txt';
const content = 'Hello, workspace.\n';

await mcp.dispatch('fs.writeFile', { path, content, workspaceRoot });

const { text } = await mcp.dispatch('fs.readFile', { path, workspaceRoot });
console.log(text === content ? 'Verified' : 'Mismatch');
```

### Batch write multiple files

Write several files sequentially. If any write is declined or fails to complete, you’ll know from ok.

```javascript
const { folders } = await mcp.dispatch('workspace.listFolders', {});
const workspaceRoot = folders[0];

const files = [
  { path: 'scaffolding/index.html', content: '<!doctype html>\n<html></html>\n' },
  { path: 'scaffolding/style.css', content: '/* starter */\n' },
  { path: 'scaffolding/app.js', content: '// entry\n' }
];

for (const f of files) {
  const { ok, path } = await mcp.dispatch('fs.writeFile', { ...f, workspaceRoot });
  if (!ok) {
    console.warn(`Skipped or failed to write: ${path}`);
  }
}
```

## Tips and constraints

- Always provide a valid workspaceRoot. Use workspace.listFolders to discover it.
- Keep paths inside the workspace. The tool is scoped for safety.
- UTF‑8 only. For binary data, use an appropriate alternative.
- Expect confirmation when overwriting; ok reflects the final outcome.
- Pair with fs.readFile to validate or post‑process what you wrote.