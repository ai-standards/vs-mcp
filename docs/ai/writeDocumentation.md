# ai.writeDocumentation — Write Documentation

This tool generates clear, audience‑appropriate documentation directly from source code. Feed it code, optionally specify a format and audience, and it returns polished docs you can preview, save, or propose as changes.

Use it when you need fast, consistent documentation for functions, modules, services, or entire files—without breaking flow. It’s ideal for README sections, API docs, and internal handbooks.

- Namespace: **ai**
- Tool id: **writeDocumentation**
- Description: Write or update documentation for code in the specified format and audience.

## What it returns

You get a documentation string in `docs` plus echo fields (`code`, and optional `format`, `audience`). You decide where it goes: open as a virtual document, save into docs/, or propose edits to an existing file.

## Inputs and outputs

- Inputs:
  - code (string, required): The source code to document.
  - format (string, optional): e.g., "markdown", "jsdoc", "docstring", "html", "rst", "readme".
  - audience (string, optional): e.g., "API consumers", "internal developers", "operators", "beginners".

- Outputs:
  - code (string): Echo of your input code.
  - format (string, optional)
  - audience (string, optional)
  - docs (string, required): The generated documentation.

## Basic usage

Generate documentation for a code snippet in Markdown for API consumers, then preview it in a virtual editor.

```javascript
// You have: mcp, server, and optional scope (a filepath)
// Basic: create docs for a snippet and preview

const code = `
export function sum(a, b) {
  return a + b;
}
`;

const { docs } = await mcp.dispatch('ai.writeDocumentation', {
  code,
  format: 'markdown',
  audience: 'API consumers'
});

await mcp.dispatch('editor.openVirtual', {
  content: docs,
  language: 'markdown'
});
```

## Variations

### Generate docs for a file (using scope or a default)

Read a file from the workspace, generate docs, and open them.

```javascript
// Resolve workspace root
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = folders?.[0];
if (!workspaceRoot) throw new Error('No workspace folder found.');

// Pick target path: use scope if given, otherwise a default
const targetPath = scope ?? `${workspaceRoot}/src/index.ts`;

// Read the file
const { text: code } = await mcp.dispatch('fs.readFile', {
  path: targetPath,
  workspaceRoot
});

// Generate docs
const { docs } = await mcp.dispatch('ai.writeDocumentation', {
  code,
  format: 'markdown',
  audience: 'internal developers'
});

// Preview
await mcp.dispatch('editor.openVirtual', {
  content: docs,
  language: 'markdown'
});
```

### Save generated docs into docs/ next to your code

Create a docs file derived from the code file name.

```javascript
// Assumes workspaceRoot and targetPath from previous example

const basename = (p) => (p.split('/').pop() || '').replace(/\.\w+$/, '');
const relName = basename(targetPath);
const docsPath = `${workspaceRoot}/docs/${relName}.md`;

// Generate docs (or reuse previously generated `docs`)
const { text: code } = await mcp.dispatch('fs.readFile', {
  path: targetPath,
  workspaceRoot
});
const { docs } = await mcp.dispatch('ai.writeDocumentation', {
  code,
  format: 'markdown',
  audience: 'API consumers'
});

// Save file
await mcp.dispatch('workspace.createWorkspaceFile', {
  path: docsPath,
  content: docs
});
```

### Propose edits to an existing documentation file

Show a diff and let the user apply changes.

```javascript
// Assumes workspaceRoot and targetPath are set

const basename = (p) => (p.split('/').pop() || '').replace(/\.\w+$/, '');
const docsPath = `${workspaceRoot}/docs/${basename(targetPath)}.md`;

// Gather code and generate new docs
const { text: code } = await mcp.dispatch('fs.readFile', {
  path: targetPath,
  workspaceRoot
});
const { docs } = await mcp.dispatch('ai.writeDocumentation', {
  code,
  format: 'markdown',
  audience: 'internal developers'
});

// Propose edits
await mcp.dispatch('editor.proposeEdits', {
  targetPath: docsPath,
  newContent: docs,
  title: `Update docs for ${targetPath}`,
  workspaceRoot
});
```

### Tune format and audience

Switching formats and audiences changes tone, structure, and depth.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = folders?.[0];
const pathToCode = scope ?? `${workspaceRoot}/src/service.ts`;

const { text: code } = await mcp.dispatch('fs.readFile', {
  path: pathToCode,
  workspaceRoot
});

// Markdown for external API consumers
const a = await mcp.dispatch('ai.writeDocumentation', {
  code,
  format: 'markdown',
  audience: 'API consumers'
});

// JSDoc blocks for internal developers
const b = await mcp.dispatch('ai.writeDocumentation', {
  code,
  format: 'jsdoc',
  audience: 'internal developers'
});

// Operator-focused runbook style
const c = await mcp.dispatch('ai.writeDocumentation', {
  code,
  format: 'markdown',
  audience: 'operators'
});

await mcp.dispatch('editor.openVirtual', {
  content: `# API docs\n\n${a.docs}\n\n# JSDoc\n\n${b.docs}\n\n# Ops\n\n${c.docs}`,
  language: 'markdown'
});
```

### Ask the user for audience or format

Prompt once, then reuse across files.

```javascript
const { value: audience } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Who is this documentation for? (e.g., API consumers, internal developers, operators)'
});

const { value: format } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Preferred format? (e.g., markdown, jsdoc, docstring)',
  placeHolder: 'markdown'
});

const code = `
/**
 * Simple queue implementation with backpressure.
 */
export class Queue { /* ... */ }
`;

const { docs } = await mcp.dispatch('ai.writeDocumentation', {
  code,
  format: format || 'markdown',
  audience: audience || 'internal developers'
});

await mcp.dispatch('editor.openVirtual', { content: docs, language: 'markdown' });
```

### Batch-generate docs across the project

Walk files, generate docs for each, and save into docs/.

```javascript
// 1) Find workspace root
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = folders?.[0];
if (!workspaceRoot) throw new Error('No workspace folder found.');

// 2) List source files
const { files } = await mcp.dispatch('workspace.listWorkspaceFiles', {
  glob: 'src/**/*.{ts,tsx,js,jsx}'
});

// 3) Generate docs one by one (simple sequential flow)
for (const file of files) {
  const { text: code } = await mcp.dispatch('fs.readFile', {
    path: file,
    workspaceRoot
  });

  const { docs } = await mcp.dispatch('ai.writeDocumentation', {
    code,
    format: 'markdown',
    audience: 'API consumers'
  });

  const rel = file.replace(workspaceRoot + '/', '').replace(/\.\w+$/, '');
  const outPath = `${workspaceRoot}/docs/${rel}.md`;

  await mcp.dispatch('workspace.createWorkspaceFile', {
    path: outPath,
    content: docs
  });
}
```

### Show progress in the status bar

Long runs benefit from minimal feedback.

```javascript
await mcp.dispatch('status.showStatusBar', {
  id: 'docs:generate',
  message: 'Generating documentation...',
  spinner: true
});

try {
  const code = `export const ping = () => 'pong';`;
  const { docs } = await mcp.dispatch('ai.writeDocumentation', {
    code,
    format: 'markdown',
    audience: 'beginners'
  });
  await mcp.dispatch('editor.openVirtual', { content: docs, language: 'markdown' });
} finally {
  await mcp.dispatch('status.dismissStatus', { id: 'docs:generate' });
}
```

## Tips

- Be explicit: set both format and audience for the best results.
- Keep the input code focused on what you want documented to reduce noise.
- Decide output destination early: preview, create a file, or propose edits.
- For large codebases, batch with a clear file mapping (e.g., docs/<relpath>.md).

## Reference

- Tool: ai.writeDocumentation
- Input:
  - code: string (required)
  - format: string (optional)
  - audience: string (optional)
- Output:
  - docs: string (required)
  - code: string
  - format?: string
  - audience?: string

The tool does one job well: turn code into documentation tailored to a reader and a format. Plug it into your editing, saving, or review workflows with a single dispatch.