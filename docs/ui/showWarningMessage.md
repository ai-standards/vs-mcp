# Show Warning Message (ui.showWarningMessage)

Surface a prominent warning to the user, optionally with action buttons. This tool is ideal for calling out risky operations, failed tasks, or anything that needs immediate attention inside VS Code.

Use it when you need a non-blocking, UI-level warning that doesn’t interrupt control flow. Add actions to suggest next steps (e.g., “Retry”, “Open Settings”). The call resolves immediately with a structured result; the effect is shown in the editor.

## What it does

- Shows a warning notification with your message.
- Optionally includes action buttons (labels you provide).
- Intended for side-effects; the return payload includes a placeholder field.

## API at a glance

- Namespace: ui
- ID: ui.showWarningMessage
- Description: Show warning message with optional actions.

Input
- message: string (required)
- actions: string[] (optional)

Output
- choice: null (always present in the current schema; not intended for branching)

## Basic usage

Show a warning with just a message. The call performs a UI side-effect; you can safely ignore the return value.

```js
// mcp: an instance of the MCP client
// server: the MCP server instance (not used directly here)
// scope: optional filepath/context string you may have available

const { choice } = await mcp.dispatch('ui.showWarningMessage', {
  message: 'Unsaved changes may be lost.'
});

// choice is null in this version of the API.
```

## Add action buttons

Add one or more action buttons to guide the user. The current schema does not return the clicked action; treat this as UI-only.

```js
await mcp.dispatch('ui.showWarningMessage', {
  message: 'Linting failed for the active file.',
  actions: ['View Problems', 'Ignore']
});

// This shows buttons but does not report which one was clicked.
```

## Pattern: ask for explicit confirmation

When you need a definite user decision, pair the warning with an input step. For example: require the user to type DELETE before proceeding.

```js
// 1) Show a prominent warning with suggested actions (UI side-effect)
await mcp.dispatch('ui.showWarningMessage', {
  message: `About to delete ${scope || 'the selected file'}. This cannot be undone.`,
  actions: ['Continue', 'Cancel']
});

// 2) Require an explicit confirm token you can verify programmatically
const { value } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Type DELETE to confirm:'
});

if ((value || '').trim().toUpperCase() !== 'DELETE') {
  await mcp.dispatch('ui.showWarningMessage', {
    message: 'Deletion canceled by user.'
  });
} else {
  // 3) Proceed with the operation (example: delete a workspace file)
  if (scope) {
    await mcp.dispatch('workspace.deleteWorkspaceFile', { path: scope });
    await mcp.dispatch('ui.showWarningMessage', {
      message: `Deleted: ${scope}`
    });
  } else {
    await mcp.dispatch('ui.showWarningMessage', {
      message: 'No file specified to delete.'
    });
  }
}
```

## Pattern: pair with status messages

Use a status bar message while doing work. If something fails, show a warning with a clear call to action.

```js
// Start a long-running task
await mcp.dispatch('status.showStatusBar', {
  id: 'build',
  message: 'Building project…',
  spinner: true
});

try {
  // ... run your build via terminals or tasks (not shown here)
  // If something goes wrong, surface the warning:
  await mcp.dispatch('ui.showWarningMessage', {
    message: 'Build failed. See output for details.',
    actions: ['Open Output']
  });
} finally {
  // Always clean up the status indicator
  await mcp.dispatch('status.dismissStatus', { id: 'build' });
}
```

## Notes and guidance

- Keep messages short and clear. Lead with the problem. If needed, follow with one sentence of context.
- Actions are best for obvious next steps (e.g., “Retry”, “Open Settings”, “View Logs”).
- VS Code typically displays up to three buttons; don’t overload the user.
- This tool is side-effect oriented. If you need a decision you can branch on, follow up with ui.showInputBox or another tool that returns a concrete result.