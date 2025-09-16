# Active File (editor.activeFile)

Get exactly what the user is looking at in the editor: the file’s absolute path, its VS Code languageId, and the current selection text (or the entire document when nothing is selected).

You reach for this tool when you need grounded context. It’s the quickest way to grab real code or prose from the active editor and feed it into generators, refactors, analyzers, or review flows. Use it to bootstrap a propose-edits flow, summarize a file, or generate tests against the current selection.

- Tool ID: editor.activeFile
- Input: none
- Output: an object like:
  - path: string (absolute file path)
  - languageId: string (VS Code language id, e.g., "typescript", "python")
  - text: string (selected text if a selection exists; otherwise full document)

Note: mcp, server, and scope are assumed to be available in all examples. scope is optional and may be the filepath you’re operating on.

## Basic usage

Fetch the active file’s path, language, and text. This is the “grab context now” call you’ll use constantly.

```javascript
// mcp, server, and scope are available in this context
try {
  const { path, languageId, text } = await mcp.dispatch('editor.activeFile', {});
  console.log({ path, languageId, preview: text.slice(0, 120) });
} catch (err) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `No active editor or unable to read active file: ${String(err)}`
  });
}
```

## Selection-aware workflows

Active File already returns selection text when a selection exists. If you also need offsets (to splice content precisely), combine with editor.selection.

```javascript
const active = await mcp.dispatch('editor.activeFile', {});
const sel = await mcp.dispatch('editor.selection', {}); // offsets + selection text

// When sel has a non-empty range, active.text equals sel.text
const isSelection = sel && typeof sel.start === 'number' && sel.end > sel.start;
console.log({
  path: active.path,
  languageId: active.languageId,
  isSelection,
  snippet: active.text.slice(0, 120),
});
```

## Explain or summarize the active code

Turn the active code (or selection) into a quick summary, then open the result as a read-only virtual document.

```javascript
const { path, languageId, text } = await mcp.dispatch('editor.activeFile', {});

const prompt = [
  `Summarize the following ${languageId} code for a teammate.`,
  `Focus on purpose, key functions, and any risks.`,
  '---',
  text
].join('\n');

const { text: summary } = await mcp.dispatch('ai.generateText', {
  prompt,
  model: 'gpt-4o-mini'
});

await mcp.dispatch('editor.openVirtual', {
  content: `# Summary for ${path}\n\n${summary}`,
  language: 'markdown'
});
```

## Refactor and propose changes to the same file

Ask for refactor instructions, generate a refactor, then propose the edits to the user with a diff. This flow keeps users in control.

```javascript
// 1) Gather context
const active = await mcp.dispatch('editor.activeFile', {});

// 2) Ask for the refactor goals
const { value: instructions } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Refactor instructions (e.g., extract function, simplify conditionals)',
  placeHolder: 'Keep behavior the same, improve readability, add JSDoc'
});

// If user canceled
if (!instructions) {
  await mcp.dispatch('ui.showInfoMessage', { message: 'Refactor canceled.' });
} else {
  // 3) Generate the refactor
  const { refactoredCode } = await mcp.dispatch('ai.refactorCode', {
    code: active.text,
    instructions,
    language: active.languageId
  });

  // 4) Find a workspace root (first folder)
  const { folders } = await mcp.dispatch('workspace.listFolders', {});
  const workspaceRoot = folders[0] || '';

  // 5) Propose changes to the same file
  const { applied } = await mcp.dispatch('editor.proposeEdits', {
    targetPath: active.path,
    newContent: refactoredCode,
    title: `Refactor: ${instructions}`,
    workspaceRoot
  });

  await mcp.dispatch('ui.showInfoMessage', {
    message: applied ? 'Refactor applied.' : 'Refactor not applied.'
  });
}
```

## Generate tests from the active file

Feed the file’s contents to the test generator and open the proposed tests in a virtual document for review.

```javascript
const { path, languageId, text } = await mcp.dispatch('editor.activeFile', {});

const { tests } = await mcp.dispatch('ai.testCode', {
  code: text,
  framework: 'jest',
  language: languageId
});

await mcp.dispatch('editor.openVirtual', {
  content: `// Tests for: ${path}\n\n${tests}`,
  language: languageId === 'typescript' ? 'typescript' : 'javascript'
});
```

## File-aware status or messaging

It’s often helpful to give quick feedback tied to the active file.

```javascript
const { path, languageId } = await mcp.dispatch('editor.activeFile', {});

await mcp.dispatch('status.showStatusBar', {
  id: 'active-file',
  message: `Active: ${path} (${languageId})`,
  spinner: false
});
```

## Practical notes

- Prefer selection for big files. Active File returns selection text when present—use that to reduce prompt size and speed up AI calls.
- Need exact positions? Pair with editor.selection for offsets; Active File is for content + identity, Selection is for coordinates.
- No active editor? Wrap calls in try/catch and give a helpful message via ui.showWarningMessage.