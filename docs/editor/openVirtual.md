# Open Virtual Document (editor.openVirtual)

Open a read-only document directly in the editor from a string. No files, no side-effects, no cleanup. When you want to show generated code, a JSON preview, logs, or a scratch note without touching the filesystem, this tool is the fast path.

Use it to:
- Preview AI output before saving.
- Inspect transformed data (e.g., pretty-printed JSON).
- Display logs or diagnostics without creating temp files.
- Render Markdown notes or code snippets with proper syntax highlighting.

At its core, editor.openVirtual takes content and an optional language, and opens a virtual, read-only buffer. You can chain it with other tools for smooth, safe previews.

## Basic Usage

Open a quick note with optional language selection from the user.

```javascript
// You have: mcp, server, scope (optional filepath)
const { value: content } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'What content do you want to open as a virtual document?'
});

if (content) {
  const { value: language } = await mcp.dispatch('ui.showInputBox', {
    prompt: 'Language id? (e.g., markdown, json, typescript) — leave empty for plain text',
    placeHolder: 'markdown'
  });

  const result = await mcp.dispatch('editor.openVirtual', {
    content,
    language: language || undefined
  }, scope);

  // result: { content, language?, ok }
  console.log('Opened virtual doc:', result);
}
```

## Specify a Language

Tell the editor how to highlight. If omitted, it opens as plain text.

```javascript
await mcp.dispatch('editor.openVirtual', {
  content: '# Release Notes\n\n- Added virtual previews\n- No files were harmed',
  language: 'markdown'
}, scope);
```

Common language ids:
- markdown
- json
- typescript
- javascript
- python
- yaml
- html
- css

## Preview JSON Safely

Pretty-print an object before you decide whether it belongs on disk.

```javascript
const payload = { ok: true, items: [1, 2, 3], meta: { source: 'mcp' } };
const content = JSON.stringify(payload, null, 2);

await mcp.dispatch('editor.openVirtual', {
  content,
  language: 'json'
}, scope);
```

## Show AI-Generated Code (Before Saving)

Generate code, then preview it read-only to decide next steps.

```javascript
const { code, language } = await mcp.dispatch('ai.generateCode', {
  prompt: 'Create a simple HTTP server',
  language: 'javascript',
  style: 'minimal'
}, scope);

await mcp.dispatch('editor.openVirtual', {
  content: code,
  language
}, scope);
```

## Preview Structured Data from AI

Ask for structured data, then render as JSON to inspect fields and shape.

```javascript
const { data } = await mcp.dispatch('ai.generateData', {
  prompt: 'Return a release plan with phases and milestones',
  schema: `{
    "type":"object",
    "properties":{
      "phases":{"type":"array","items":{"type":"string"}},
      "milestones":{"type":"array","items":{"type":"string"}}
    },
    "required":["phases","milestones"]
  }`,
  temperature: 0.2
}, scope);

await mcp.dispatch('editor.openVirtual', {
  content: JSON.stringify(data, null, 2),
  language: 'json'
}, scope);
```

## Read a Workspace File, Open as Virtual

Useful for read-only inspection, or when you want a syntax-highlighted view that you won’t accidentally edit.

```javascript
// Pick a workspace root, then read a file, then show it virtually
const { folders } = await mcp.dispatch('workspace.listFolders', {}, scope);
const workspaceRoot = folders[0];

const { value: relPath } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Which file (relative to workspace root) do you want to preview?',
  placeHolder: 'src/index.ts'
}, scope);

if (workspaceRoot && relPath) {
  const absPath = `${workspaceRoot}/${relPath}`;
  const { text } = await mcp.dispatch('fs.readFile', {
    path: absPath,
    workspaceRoot
  }, scope);

  await mcp.dispatch('editor.openVirtual', {
    content: text,
    language: relPath.endsWith('.ts') ? 'typescript' : undefined
  }, scope);
}
```

## Show Logs or Diagnostics

Render ephemeral logs without polluting your workspace with temp files.

```javascript
const logs = [
  '[12:00:01] Build started',
  '[12:00:05] Compiled 17 modules',
  '[12:00:06] Warning: unused variable in utils.ts:42'
].join('\n');

await mcp.dispatch('editor.openVirtual', {
  content: logs,
  language: 'log' // if your editor recognizes it; otherwise omit
}, scope);
```

## Review Changes Before Applying

Combine a generated or refactored version with a preview. If you decide it’s good, propose a diff to the real file.

```javascript
const { folders } = await mcp.dispatch('workspace.listFolders', {}, scope);
const workspaceRoot = folders[0];
const targetPath = `${workspaceRoot}/README.md`;

// Generate new content (e.g., documentation)
const { docs } = await mcp.dispatch('ai.writeDocumentation', {
  code: 'export function add(a,b){return a+b}',
  format: 'markdown',
  audience: 'contributors'
}, scope);

// Preview virtually first
await mcp.dispatch('editor.openVirtual', {
  content: docs,
  language: 'markdown'
}, scope);

// Then ask to apply via diff
await mcp.dispatch('editor.propose-edits', {
  targetPath,
  newContent: docs,
  title: 'Update README with generated docs',
  workspaceRoot
}, scope);
```

## Behavior and Guarantees

- Read-only: You can’t edit or save the virtual document directly.
- No persistence: Closing the tab discards it.
- Idempotent content: The tool returns the content and language you provided, plus an ok flag, so you can confirm the action programmatically.
- Workspace-agnostic: It doesn’t require a file path. Use it anywhere you need a temporary view.

## Input

- content (string, required): The full text to display.
- language (string, optional): A language id for syntax highlighting.

## Output

- content (string, required): Echo of the provided content.
- language (string, optional): Echo of the provided language.
- ok (boolean): Operation success indicator.

## Tips

- Use specific language ids to unlock syntax highlighting, folding, and extensions.
- For large objects, always pretty-print (JSON.stringify with spacing) to keep it readable.
- Pair with UI prompts to create quick scratchpads or Markdown notes on demand.
- When you’re ready to persist, switch to workspace.create-file or fs.write-file.