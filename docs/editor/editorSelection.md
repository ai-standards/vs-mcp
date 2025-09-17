# Editor Selection (editor.editorSelection)

The Editor Selection tool fetches the current selection from the active editor: the selected text and its numeric offsets within the document. You use it when you need to read exactly what the user highlighted and where it sits, so you can transform it, analyze it, or apply edits precisely.

This tool is non-interactive and has no inputs. It’s the simplest way to bridge a user’s intent (their selection) to automated actions like AI explanations, refactors, or workspace edits.

## What it returns

- The selected text.
- The selection’s start and end offsets (0-based, end-exclusive).
- Offsets are relative to the document’s start.

If there’s no selection, the tool reports an empty selection (text length 0). Always check before acting.

## API

- Namespace and id: editor.editorSelection
- Input: none
- Output: an object with at least:
  - text: string
  - startOffset: number (inclusive)
  - endOffset: number (exclusive)

## Basic usage

```javascript
// Assume these are already available in your environment:
const mcp = /* MCP client instance */;
const server = /* MCP server instance */;
const scope = /* optional filepath or context string */;

const selection = await mcp.dispatch('editor.editorSelection', {});

if (!selection || !selection.text || selection.text.length === 0) {
  console.log('No selection in the active editor.');
} else {
  console.log('Selected text:', selection.text);
  console.log('Offsets:', selection.startOffset, selection.endOffset);
}
```

## Variations

### Show a quick summary in the status window

Use the selection length to give immediate feedback.

```javascript
// Assume: mcp, server, scope
const sel = await mcp.dispatch('editor.editorSelection', {});
const len = sel?.text?.length ?? 0;

await mcp.dispatch('status.showStatusWindow', {
  id: 'editor-selection-summary',
  message: len === 0 ? 'No selection' : `Selected ${len} character(s)`,
});
```

### Explain the selected code with AI

Pass the selection to the text generator and surface the result.

```javascript
// Assume: mcp, server, scope
const sel = await mcp.dispatch('editor.editorSelection', {});
if (!sel.text) {
  await mcp.dispatch('ui.showInfoMessage', { message: 'Select some code first.' });
} else {
  const result = await mcp.dispatch('ai.generateText', {
    prompt: `Explain what this code does:\n\n${sel.text}`,
    temperature: 0.2,
  });

  await mcp.dispatch('editor.openVirtual', {
    content: `Explanation:\n\n${result.text}`,
    language: 'markdown',
  });
}
```

### Open the selection in a scratch (virtual) document

Great for inspecting, comparing, or editing the snippet independently.

```javascript
// Assume: mcp, server, scope
const sel = await mcp.dispatch('editor.editorSelection', {});
if (!sel.text) {
  await mcp.dispatch('ui.showInfoMessage', { message: 'Nothing selected.' });
} else {
  await mcp.dispatch('editor.openVirtual', {
    content: sel.text,
    language: 'plaintext',
  });
}
```

### Wrap the selection and propose an edit

Use offsets to reconstruct the new document content, then propose the change via a diff flow.

```javascript
// Assume: mcp, server, scope
const sel = await mcp.dispatch('editor.editorSelection', {});
if (!sel.text) {
  await mcp.dispatch('ui.showInfoMessage', { message: 'Select text to wrap.' });
} else {
  // Get active file metadata and full text
  const active = await mcp.dispatch('editor.activeFile', {});
  if (!active?.path || !active?.text) {
    throw new Error('No active file open.');
  }

  // Choose a workspace root (first folder)
  const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
  const workspaceRoot = folders?.[0];
  if (!workspaceRoot) {
    throw new Error('No workspace folder found.');
  }

  // Build new content using numeric offsets
  const before = active.text.slice(0, sel.startOffset);
  const after = active.text.slice(sel.endOffset);
  const wrapped = `/* BEGIN */\n${sel.text}\n/* END */`;

  const newContent = before + wrapped + after;

  // Propose the edits (user sees a diff and can accept)
  await mcp.dispatch('editor.proposeEdits', {
    targetPath: active.path,
    newContent,
    title: 'Wrap selection with markers',
    workspaceRoot,
  });
}
```

### Save the selection as a workspace snippet

Persist the selection into the workspace. The path can come from scope or a fixed location.

```javascript
// Assume: mcp, server, scope
const sel = await mcp.dispatch('editor.editorSelection', {});
if (!sel.text) {
  await mcp.dispatch('ui.showInfoMessage', { message: 'Select text to save.' });
} else {
  const targetPath = scope || 'snippets/selection.txt';
  const { success, error } = await mcp.dispatch('workspace.createWorkspaceFile', {
    path: targetPath,
    content: sel.text,
  });
  if (success === false && error) {
    console.error('Failed to save snippet:', error);
  } else {
    await mcp.dispatch('ui.showInfoMessage', { message: `Saved selection to ${targetPath}` });
  }
}
```

### Refactor the selection with AI, then preview

Ask AI to refactor just the selected code, then open the result in a virtual doc for review.

```javascript
// Assume: mcp, server, scope
const sel = await mcp.dispatch('editor.editorSelection', {});
if (!sel.text) {
  await mcp.dispatch('ui.showInfoMessage', { message: 'Select code to refactor.' });
} else {
  const { refactoredCode } = await mcp.dispatch('ai.refactorCode', {
    code: sel.text,
    instructions: 'Refactor for readability and add brief comments.',
    language: 'typescript',
  });

  await mcp.dispatch('editor.openVirtual', {
    content: refactoredCode,
    language: 'typescript',
  });
}
```

## Notes and tips

- Requires an active editor. If none is open, you’ll get no selection.
- Offsets are 0-based and end-exclusive. Example: for "abc", selecting "ab" yields startOffset 0, endOffset 2.
- Always handle the empty selection case before invoking tools that expect non-empty input.