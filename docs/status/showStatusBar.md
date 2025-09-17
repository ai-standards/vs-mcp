# Show Status Bar (status.showStatusBar)

The Show Status Bar tool displays a short, persistent message in VS Code’s status bar. It’s ideal for indicating progress (“Running tests…”), success (“Build complete”), or background work with an optional spinner.

You’ll want this when your workflow spans multiple steps and you don’t want to block the UI or spam popups. It provides a low-friction, always-visible indicator that you can update or dismiss as your task advances.

- Fully-qualified tool id: status.showStatusBar
- Source: src/tools/status/bar.mcpx.ts
- Pairs well with: status.dismissStatus (to clear a message) and status.showStatusWindow (for popup-style notifications)

## Basic usage

Show a message. The id ties the message to your task so you can update or dismiss it later.

```javascript
// mcp, server, and scope (optional filepath) are available in this context

const result = await mcp.dispatch('status.showStatusBar', {
  id: 'doc:generate',
  message: 'Generating documentation…'
});

console.log(result);
// -> { id: 'doc:generate', message: 'Generating documentation…', spinner: false, shown: true }
```

## Show a spinner

Add a spinner to signal that something is actively running.

```javascript
await mcp.dispatch('status.showStatusBar', {
  id: 'build',
  message: 'Building project…',
  spinner: true
});
```

## Update an existing status

Call the tool again with the same id to replace the current message and spinner state. Then dismiss when you’re done.

```javascript
// Start
await mcp.dispatch('status.showStatusBar', {
  id: 'pipeline',
  message: 'Compiling…',
  spinner: true
});

// Midway
await mcp.dispatch('status.showStatusBar', {
  id: 'pipeline',
  message: 'Bundling…',
  spinner: true
});

// Finish (stop spinner)
await mcp.dispatch('status.showStatusBar', {
  id: 'pipeline',
  message: 'Build complete',
  spinner: false
});

// Clear it
await mcp.dispatch('status.dismissStatus', { id: 'pipeline' });
```

## Use scope to namespace your id

Scope is an optional filepath available in this context. Use it to generate stable, unique ids across files or tasks.

```javascript
const statusId = `lint:${scope ?? 'workspace'}`;

await mcp.dispatch('status.showStatusBar', {
  id: statusId,
  message: 'Linting…',
  spinner: true
});

// Later
await mcp.dispatch('status.showStatusBar', {
  id: statusId,
  message: 'Lint passed',
  spinner: false
});
```

## Long-running task pattern

Show progress at the start, update as you go, and always clean up.

```javascript
const id = 'release:publish';

try {
  await mcp.dispatch('status.showStatusBar', {
    id,
    message: 'Publishing release…',
    spinner: true
  });

  // Example step 1
  await mcp.dispatch('status.showStatusBar', {
    id,
    message: 'Tagging version…',
    spinner: true
  });

  // Example step 2
  await mcp.dispatch('status.showStatusBar', {
    id,
    message: 'Uploading assets…',
    spinner: true
  });

  // Done
  await mcp.dispatch('status.showStatusBar', {
    id,
    message: 'Release published',
    spinner: false
  });
} catch (err) {
  await mcp.dispatch('status.showStatusBar', {
    id,
    message: 'Release failed',
    spinner: false
  });
  throw err;
} finally {
  await mcp.dispatch('status.dismissStatus', { id });
}
```

## Integrate with other tools (example: terminal task)

Show a spinner while running a command in a terminal, then stop and dismiss.

```javascript
const id = 'task:tests';

await mcp.dispatch('status.showStatusBar', {
  id,
  message: 'Running tests…',
  spinner: true
});

const { terminalId } = await mcp.dispatch('terminal.createTerminal', { name: 'Tests' });
await mcp.dispatch('terminal.sendTextToTerminal', { terminalId, text: 'npm test\n' });

// Simulate completion signal; replace with your own check
await new Promise(r => setTimeout(r, 3000));

await mcp.dispatch('status.showStatusBar', {
  id,
  message: 'Tests complete',
  spinner: false
});

await mcp.dispatch('status.dismissStatus', { id });
```

## API reference

- Namespace: status
- Tool id: showStatusBar
- Description: Show a status message in the status bar. Optionally show a spinner.

Input:
- id (string, required): Stable identifier for the status item. Use this to update or dismiss the same item.
- message (string, required): The text shown in the status bar.
- spinner (boolean, optional): Show an activity spinner. Defaults to false.

Output:
- id (string): Echo of the id you passed.
- message (string): Echo of the message shown.
- spinner (boolean): Whether the spinner is active.
- shown (boolean): True if the status item is visible.

## Usage notes

- Choose stable ids: Derive ids from task names and scope (e.g., build:app, lint:path/to/file.ts).
- Update instead of stacking: Reuse the same id as your task advances.
- Always dismiss: Clear status items when they’re no longer relevant using status.dismissStatus.
- Keep messages short: Status bar space is limited; focus on the essential state.
- Spinner etiquette: Start the spinner only for truly active work, and stop it as soon as the step completes.

## Related tools

- status.dismissStatus — Dismiss a status notification by id.
- status.showStatusWindow — Show a one-off popup-style notification. Use this for attention-grabbing alerts; keep status.showStatusBar for ambient progress.