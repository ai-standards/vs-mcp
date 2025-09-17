# VSCode editor integration

The editor MCPs contains tools that work directly with the VS Code editor: reading what the user is looking at, opening files or virtual documents, and proposing diffs for review. These are the building blocks for context-aware flows, like summarizing the current file, refactoring a selection, previewing generated output, or guiding users through safe, review-first changes.

Use editor tools to:
- Grab grounded, real-time context from the active editor (file path, language, selection).
- Open files by absolute path or display temporary, read-only content.
- Propose edits via a diff view that keeps the user in control.
They pair naturally with ai.*, workspace.*, fs.*, and ui.* tools to create seamless “read → transform → preview → apply” workflows.

## [Active File (editor.activeFile)](docs/editor/editor.activeFile.md)

Get exactly what the user is looking at in the editor: the file’s absolute path, its VS Code languageId, and the current selection text (or the entire document if nothing is selected). Use this to ground AI calls, bootstrap propose-edits flows, or generate tests against the current selection.

Example (basic usage):

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

## [Editor Selection (editor.editorSelection)](docs/editor/editor.editorSelection.md)

Fetch the current selection from the active editor: the selected text and its numeric offsets within the document. Use it to perform precise, selection-aware transforms, analyses, or edits.

Example (basic usage):

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

## [Open File By Path (editor.openFile)](docs/editor/editor.openFile.md)

Open any file in VS Code by absolute path. Great when you already know the path or have resolved one via workspace/filesystem tools.

Example (quick start):

```javascript
const { ok } = await mcp.dispatch('editor.openFile', {
  path: '/Users/alex/projects/app/src/index.ts'
});
```

## [Open Virtual Document (editor.openVirtual)](docs/editor/editor.openVirtual.md)

Open a read-only document from a string—no files, no side-effects. Perfect for previewing AI output, inspecting JSON, showing logs, or scratch notes with syntax highlighting.

Example (basic usage):

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

## [Propose Edits (editor.proposeEdits)](docs/editor/editor.proposeEdits.md)

Show a VS Code-style diff between a file and proposed new content, then let the user accept or cancel. Use this to keep human-in-the-loop review for AI-generated changes, refactors, or migrations.

Example (basic usage):

```javascript
// Basic: prepend a heading to README.md (or to `scope` if provided)
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = folders[0];

const targetPath = scope || 'README.md';

// Read the current content
const { text } = await mcp.dispatch('fs.readFile', {
  path: targetPath,
  workspaceRoot
});

// Ask the user for a heading to add
const { value: heading } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Heading to add (e.g., Project Overview):'
});

if (!heading) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: 'No heading provided. Aborting.'
  });
} else {
  const newContent = `# ${heading}\n\n${text}`;

  // Propose the edit
  const result = await mcp.dispatch('editor.proposeEdits', {
    targetPath,
    newContent,
    workspaceRoot,
    title: `Add heading: ${heading}`
  });

  if (result.applied) {
    await mcp.dispatch('ui.showInfoMessage', {
      message: `Applied changes to ${targetPath}`
    });
  } else {
    await mcp.dispatch('ui.showInfoMessage', {
      message: `No changes applied to ${targetPath}`
    });
  }
}
```