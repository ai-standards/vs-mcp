# Dismiss Status (status.dismissStatus)

Status messages are great when you need quick, non-blocking feedback in VS Code. They appear either in the status bar or as window notifications. The Dismiss Status tool gives you precise control to remove a status message by its ID—exactly when your task completes or when it’s no longer relevant.

Use it to clean up spinners after long-running jobs, close notifications that have been acknowledged, or ensure your UI stays quiet when workflows end early.

- Namespace: **status**
- Tool ID: **dismissStatus**
- Description: Dismiss any status notification by ID.
- Input:
  - id (string, required): The identifier you used when showing the status.
- Output:
  - id (string): Echoes the ID you requested to dismiss.
  - dismissed (boolean): Whether a status with that ID was dismissed.

## Basic usage

Dismiss a status you previously showed with the same ID.

```javascript
// mcp, server, and scope (optional path) are available in this context.

const { dismissed, id } = await mcp.dispatch('status.dismissStatus', {
  id: 'build:spinner'
});
```

## Show a status bar spinner, then dismiss

Use showStatusBar to display a spinner while work is in progress, and dismiss it in a finally block to guarantee cleanup.

```javascript
// Show a spinner in the status bar.
await mcp.dispatch('status.showStatusBar', {
  id: 'build:spinner',
  message: 'Building...',
  spinner: true
});

// Do the work, then always dismiss.
try {
  // ... your build logic ...
} finally {
  const { dismissed } = await mcp.dispatch('status.dismissStatus', {
    id: 'build:spinner'
  });
}
```

## Show a window notification, then dismiss

Window notifications are more prominent. You can dismiss them once acknowledged or after your workflow finishes.

```javascript
// Show a window notification.
await mcp.dispatch('status.showStatusWindow', {
  id: 'deploy:notice',
  message: 'Deploy started...'
});

// After deploy completes, dismiss the notification.
const { dismissed } = await mcp.dispatch('status.dismissStatus', {
  id: 'deploy:notice'
});
```

## Using scope (optional)

If your environment associates operations with a file context, pass scope as the third argument to dispatch.

```javascript
// scope is a filepath or project-specific context.
const { dismissed } = await mcp.dispatch(
  'status.dismissStatus',
  { id: 'lint:status' },
  { scope }
);
```

## Dismiss multiple statuses

If you manage several status IDs during a pipeline, clean them up together.

```javascript
const ids = ['test:spinner', 'build:spinner', 'publish:notice'];

await Promise.all(
  ids.map(id => mcp.dispatch('status.dismissStatus', { id }))
);
```

## Safe, idempotent cleanup

It’s fine to call dismiss more than once. Check the return to see if anything was actually dismissed.

```javascript
const result = await mcp.dispatch('status.dismissStatus', { id: 'unknown:id' });

if (!result.dismissed) {
  // Nothing to dismiss for this ID—already cleared or never shown.
}
```

## Combine with user input

Prompt the user for an ID, then dismiss it. This mirrors real-world debugging or admin tools.

```javascript
const { value: id } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Enter the status ID to dismiss'
});

if (id) {
  const { dismissed } = await mcp.dispatch('status.dismissStatus', { id });
}
```

## Patterns that work well

- Always pair show + dismiss:
  - status.showStatusBar → status.dismissStatus
  - status.showStatusWindow → status.dismissStatus
- Wrap long-running tasks with show at start and dismiss in finally.
- Keep IDs structured (e.g., feature:action) for easy bulk cleanup.

That’s it—simple, explicit control over status lifecycle so your UI stays clean and intentional.