# Show Status Window (status.showStatusWindow)

Show a high-visibility status message as a VS Code window notification. When the message matters—build finished, tests failed, credentials expired—this is the surface that gets noticed.

Use it to surface important, time-bound events. Pair it with status bar updates for ongoing progress, then elevate to a window notification when you have a final outcome.

- Input: id (string), message (string)
- Output: id (string), message (string), shown (boolean)

## Basic usage

Show a single notification. Reuse the id later to update or dismiss it.

```javascript
// mcp, server, and scope are available in this context

const { id, message, shown } = await mcp.dispatch('status.showStatusWindow', {
  id: 'welcome',
  message: 'Hello! You’re ready to go.'
});
```

## Update or replace a notification

Call the tool again with the same id to replace/refresh the existing notification’s content.

```javascript
await mcp.dispatch('status.showStatusWindow', {
  id: 'onboarding',
  message: 'Setting things up…'
});

// Later: update the same notification
await mcp.dispatch('status.showStatusWindow', {
  id: 'onboarding',
  message: 'All set. Happy coding!'
});
```

## Dismiss a notification

When you control the lifecycle explicitly, dismiss by id using status.dismissStatus. This removes any status by that id (bar or window).

```javascript
// Show
await mcp.dispatch('status.showStatusWindow', {
  id: 'sync:done',
  message: 'Sync completed successfully.'
});

// Dismiss when appropriate
await mcp.dispatch('status.dismissStatus', { id: 'sync:done' });
```

## Pair with the status bar for progress

Use the status bar for ongoing work (with a spinner), then switch to a window notification with the final result.

```javascript
// Start: show progress in the status bar
await mcp.dispatch('status.showStatusBar', {
  id: 'build',
  message: 'Building…',
  spinner: true
});

// Simulate work (replace with your own flow)
await new Promise(r => setTimeout(r, 2000));

// End: hide the spinner and announce completion
await mcp.dispatch('status.dismissStatus', { id: 'build' });
await mcp.dispatch('status.showStatusWindow', {
  id: 'build:result',
  message: 'Build completed successfully.'
});
```

## File-scoped notifications

Tie notifications to the current file. Derive the id from scope to avoid collisions across files.

```javascript
const fileId = `lint:${scope || 'untitled'}`;

await mcp.dispatch('status.showStatusWindow', {
  id: fileId,
  message: `Lint results available for ${scope || 'unsaved file'}.`
});
```

## Notify after editor actions

Combine editor tools with a final window notification so users know the outcome without scanning the status bar.

```javascript
// Open a virtual preview
await mcp.dispatch('editor.openVirtual', {
  content: '# Preview\n\nGenerated content goes here.',
  language: 'markdown'
});

// Announce the action
await mcp.dispatch('status.showStatusWindow', {
  id: 'preview:open',
  message: 'Preview opened in a read-only document.'
});
```

## Announce workspace operations

Make workspace changes and confirm them with a notification.

```javascript
const path = `${scope || '.'}/README.generated.md`;

const { success } = await mcp.dispatch('workspace.createWorkspaceFile', {
  path,
  content: '# Generated README\n\nThis file was created by a tool.'
});

await mcp.dispatch('status.showStatusWindow', {
  id: `create:${path}`,
  message: success
    ? `Created ${path}`
    : `Could not create ${path}`
});
```

## Practical notes

- Choose ids you can reuse. A good pattern is namespace:action:target (e.g., build:result:app).
- Window notifications are for outcomes, not streaming progress. Use status.showStatusBar while work is ongoing.
- Keep messages concise; long strings may be truncated by the UI.