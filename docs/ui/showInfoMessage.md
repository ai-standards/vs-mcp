# ui.showInfoMessage — Show an information message with optional actions

This tool pops an information toast in the editor. Use it to notify the user and, optionally, present a few actionable choices (buttons). It’s perfect for lightweight decisions: “Open logs?”, “Push now or later?”, “Overwrite or cancel?”.

You reach for ui.showInfoMessage when you want quick feedback or a small branch in flow without a full dialog. It returns the user’s choice (one of your action labels) or null if dismissed.

- Tool id: ui.showInfoMessage
- Namespace: ui
- Description: Show info message with optional actions.

## Parameters and return

- Input
  - message (string, required): The message text.
  - actions (string[], optional): Up to a handful of button labels the user can click.
- Output
  - choice (string | null): The selected action label, or null if the message was dismissed or no actions were provided.

Tip: Keep actions short and mutually exclusive. If you need validation or text input, use [ui.showInputBox](#see-also).

## Basic usage

Display an informational message without actions. It resolves when the notification is dismissed.

```javascript
// Assumed in all examples:
// - mcp: an MCP client instance
// - server: the MCP server instance (not used directly here)
// - scope: optional filepath string relevant to your flow

const { choice } = await mcp.dispatch('ui.showInfoMessage', {
  message: 'Build completed successfully.'
});

// choice will be null because no actions were provided.
```

## Message with actions

Add buttons to collect a quick decision. The resolved choice will match one of your action labels, or null if the user dismissed the toast.

```javascript
const { choice } = await mcp.dispatch('ui.showInfoMessage', {
  message: 'Build finished. What next?',
  actions: ['Open summary', 'Dismiss']
});

if (choice === 'Open summary') {
  // Show a quick summary in a virtual document.
  await mcp.dispatch('editor.openVirtual', {
    content: 'Build summary:\n- 0 errors\n- 3 warnings\n- Output: dist/',
    language: 'markdown'
  });
}
```

## Confirm pattern (Yes/No)

Use two clear actions for a safe confirmation flow.

```javascript
const targetPath = scope || '/absolute/path/to/output.txt';

const { choice } = await mcp.dispatch('ui.showInfoMessage', {
  message: `Overwrite file?\n${targetPath}`,
  actions: ['Overwrite', 'Cancel']
});

if (choice === 'Overwrite') {
  await mcp.dispatch('workspace.createFile', {
    path: targetPath,
    content: 'Fresh content\n'
  });
}
```

## Post-action flows (VCS example)

Chain user intent to your workflow. Here we commit, then optionally push.

```javascript
// 1) Commit changes.
const commit = await mcp.dispatch('vcs.commitChanges', {
  message: 'Refactor: extract helper and update docs'
});

// 2) If commit succeeded, offer to push.
if (!commit.error) {
  const { choice } = await mcp.dispatch('ui.showInfoMessage', {
    message: 'Committed changes.',
    actions: ['Push now', 'Later']
  });

  if (choice === 'Push now') {
    await mcp.dispatch('vcs.pushChanges', {});
  }
} else {
  await mcp.dispatch('ui.showInfoMessage', {
    message: `Commit failed: ${commit.error}`
  });
}
```

## Triage next steps (Editor + Terminal)

Offer quick follow-ups after generating tests.

```javascript
// Generate tests for the active file's code (hypothetical flow).
const code = `
export function add(a, b) { return a + b; }
`;

const tests = await mcp.dispatch('ai.testCode', {
  code,
  framework: 'vitest',
  language: 'typescript'
});

// Propose writing tests to a target path and let the user decide next.
const { choice } = await mcp.dispatch('ui.showInfoMessage', {
  message: 'Tests generated. What would you like to do?',
  actions: ['Review diff', 'Run tests', 'Dismiss']
});

if (choice === 'Review diff') {
  await mcp.dispatch('editor.propose-edits', {
    targetPath: scope || '/workspace/src/add.test.ts',
    newContent: tests.tests,
    title: 'Proposed unit tests',
    workspaceRoot: '/workspace'
  });
} else if (choice === 'Run tests') {
  const { terminalId } = await mcp.dispatch('terminal.createTerminal', { name: 'Tests' });
  await mcp.dispatch('terminal.sendTextToTerminal', {
    terminalId,
    text: 'npm test\n'
  });
  await mcp.dispatch('terminal.showTerminal', { terminalId });
}
```

## Handling dismissals and defaults

Always handle null to cover Esc/dismiss.

```javascript
const { choice } = await mcp.dispatch('ui.showInfoMessage', {
  message: 'Documentation written. Next step?',
  actions: ['Open preview', 'Commit later']
});

switch (choice) {
  case 'Open preview': {
    await mcp.dispatch('editor.openVirtual', {
      content: '# Preview\nYour freshly generated docs.',
      language: 'markdown'
    });
    break;
  }
  case 'Commit later': {
    // No-op now; maybe schedule a reminder.
    break;
  }
  default: {
    // choice === null (dismissed); pick a safe default.
  }
}
```

## Behavior and guidelines

- Show brief, actionable messages. For warnings or destructive operations, consider [ui.showWarningMessage](#see-also).
- Keep action count low (2–3 is ideal). Order actions by likely intent.
- Expect null when the user dismisses the message. Code defensively.
- For long-running tasks, pair with [status.showStatusBar](#see-also) or [status.showStatusWindow](#see-also).

## API reference

- Id: ui.showInfoMessage
- Path: src/tools/ui/info.mcpx.ts
- Input
  - message: string (required)
  - actions: string[] (optional)
- Output
  - choice: null (represents the selected action label or a dismissed state)

## See also

- ui.showWarningMessage — warning variant with the same shape.
- ui.showInputBox — prompt for a string value.
- status.showStatusBar — persistent status indicator.
- status.showStatusWindow — window notification.
- vcs.commitChanges, vcs.pushChanges — pair nicely with post-commit prompts.
- editor.openVirtual, editor.propose-edits — good destinations after a choice.