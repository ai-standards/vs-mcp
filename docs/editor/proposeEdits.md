# Propose Edits (editor.proposeEdits)

Propose Edits lets you preview a diff and ask the user to apply changes to a file in the workspace. You provide the target file and the full new content; the tool opens a diff view and the user chooses whether to apply the update.

Use it when you want a safe, review-first workflow—especially for AI-generated changes, refactors, or bulk edits. You can chain it with other tools (e.g., read a file, generate an update, then propose and optionally commit).

## What it does

- Shows a VS Code-style diff between the current file and your proposed content.
- Lets the user accept or cancel the change.
- Returns whether the change was applied.

## When to use it

- You’ve generated new content (with AI or code) and want a human-in-the-loop review.
- You want consistent UX for edits without writing VS Code UI code yourself.
- You’re running multi-file transformations and want per-file confirmation.

## Inputs and outputs

- Input
  - targetPath (string, required): Path to the file inside the workspace (relative to workspaceRoot).
  - newContent (string, required): The full replacement content for the file.
  - title (string, optional): A short label for the diff view.
  - workspaceRoot (string, required): The workspace folder containing the file.
- Output
  - targetPath (string)
  - newContent (string)
  - title (string | undefined)
  - workspaceRoot (string)
  - applied (boolean): true if the user applied the change.

Tip: If you don’t know the workspace root, ask the workspace for folders and pick one.

## Basic usage

In all examples:
- mcp is your MCP client instance.
- server is the MCP server instance.
- scope is an optional file path you want to operate on.

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

## Customize the diff title

Add a descriptive title so the user knows what they’re reviewing.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = folders[0];

const targetPath = scope || 'src/index.ts';
const { text } = await mcp.dispatch('fs.readFile', {
  path: targetPath,
  workspaceRoot
});

// Simple transform: ensure file ends with a newline
const newContent = text.endsWith('\n') ? text : `${text}\n`;

const result = await mcp.dispatch('editor.proposeEdits', {
  targetPath,
  newContent,
  workspaceRoot,
  title: 'Normalize: ensure trailing newline'
});

if (result.applied) {
  await mcp.dispatch('ui.showInfoMessage', {
    message: 'Trailing newline enforced.'
  });
}
```

## AI-assisted refactor, then propose

Generate changes with AI, then hand the decision to the user.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = folders[0];

const targetPath = scope || 'src/utils/formatters.js';
const { text } = await mcp.dispatch('fs.readFile', {
  path: targetPath,
  workspaceRoot
});

// Ask AI to refactor
const { refactoredCode } = await mcp.dispatch('ai.refactorCode', {
  code: text,
  instructions: 'Convert var to let/const where appropriate and prefer early returns.',
  language: 'javascript',
  style: 'idiomatic'
});

// If AI returns identical content, skip proposing
if (refactoredCode === text) {
  await mcp.dispatch('ui.showInfoMessage', {
    message: 'No changes detected from refactor.'
  });
} else {
  const result = await mcp.dispatch('editor.proposeEdits', {
    targetPath,
    newContent: refactoredCode,
    workspaceRoot,
    title: 'AI Refactor: modernize declarations'
  });

  if (result.applied) {
    await mcp.dispatch('ui.showInfoMessage', {
      message: 'Refactor applied.'
    });
  }
}
```

## Interactive search-and-replace, then propose

Let the user define the transformation, compute the new content, and propose.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = folders[0];

const targetPath = scope || 'src/app.css';
const { text } = await mcp.dispatch('fs.readFile', {
  path: targetPath,
  workspaceRoot
});

const { value: from } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Find text:'
});
const { value: to } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Replace with:'
});

if (!from) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: 'No find text provided. Aborting.'
  });
} else {
  const newContent = text.split(from).join(to ?? '');

  if (newContent === text) {
    await mcp.dispatch('ui.showInfoMessage', {
      message: 'No occurrences found; nothing to change.'
    });
  } else {
    await mcp.dispatch('editor.proposeEdits', {
      targetPath,
      newContent,
      workspaceRoot,
      title: `Replace "${from}" with "${to ?? ''}"`
    });
  }
}
```

## Multi-file migration with per-file confirmation

Walk a glob of files, compute each file’s proposed content, and ask the user one by one.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = folders[0];

// Find all markdown files
const { files } = await mcp.dispatch('workspace.listWorkspaceFiles', {
  glob: '**/*.md'
});

for (const targetPath of files) {
  const { text } = await mcp.dispatch('fs.readFile', {
    path: targetPath,
    workspaceRoot
  });

  // Example: ensure H1 exists at top
  const hasH1 = text.trimStart().startsWith('# ');
  const newContent = hasH1 ? text : `# ${targetPath}\n\n${text}`;

  if (newContent === text) continue;

  const { applied } = await mcp.dispatch('editor.proposeEdits', {
    targetPath,
    newContent,
    workspaceRoot,
    title: 'Docs migration: ensure H1 at top'
  });

  // Optional: stop if the user cancels once
  if (!applied) {
    await mcp.dispatch('ui.showInfoMessage', {
      message: `Change not applied for ${targetPath}; stopping migration.`
    });
    break;
  }
}
```

## Apply and commit on approval

After the user accepts the change, you can chain a commit.

```javascript
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = folders[0];

const targetPath = scope || 'src/main.ts';
const { text } = await mcp.dispatch('fs.readFile', {
  path: targetPath,
  workspaceRoot
});

// Example edit
const newContent = text.replace(/console\.log/g, 'console.debug');

const result = await mcp.dispatch('editor.proposeEdits', {
  targetPath,
  newContent,
  workspaceRoot,
  title: 'Lower log level: log -> debug'
});

if (result.applied) {
  const { success, error } = await mcp.dispatch('vcs.commitChanges', {
    message: `chore: lower log level in ${targetPath}`
  });

  if (!success && error) {
    await mcp.dispatch('ui.showWarningMessage', {
      message: `Commit failed: ${error}`
    });
  }
}
```

## Error handling pattern

Wrap calls and report failures without crashing the session.

```javascript
try {
  const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
  if (!folders?.length) throw new Error('No workspace folder found.');

  const workspaceRoot = folders[0];
  const targetPath = scope || 'package.json';

  const { text } = await mcp.dispatch('fs.readFile', {
    path: targetPath,
    workspaceRoot
  });

  const newContent = text; // no-op example; replace with your logic

  await mcp.dispatch('editor.proposeEdits', {
    targetPath,
    newContent,
    workspaceRoot,
    title: 'No-op example'
  });
} catch (err) {
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Propose Edits failed: ${err?.message || String(err)}`
  });
}
```

## Practical notes

- Pass paths relative to the selected workspaceRoot.
- Propose Edits operates on full file content. If you need a partial edit, compute the full new content first.
- Use a clear, actionable title. It helps users decide quickly.
- Combine with:
  - fs.readFile to get current content.
  - ai.refactorCode or ai.generateCode to produce new content.
  - workspace.listWorkspaceFiles for bulk operations.
  - vcs.commitChanges to finalize changes after approval.