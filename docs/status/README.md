# status namespace

The status namespace gives you simple, non-blocking ways to communicate progress and outcomes in VS Code via the status bar and window notifications. Use it to keep users informed during long-running tasks, to announce results, and to maintain a clean UI by explicitly dismissing messages when they’re no longer needed.

Why you might use it:
- Show ambient progress with a status bar message and optional spinner.
- Elevate important outcomes with a window notification.
- Manage the lifecycle of messages predictably by addressing them with stable ids and dismissing them when done.

Common patterns:
- Start a task: show a spinner in the status bar.
- Update as you go: reuse the same id to change the message.
- Finish: stop the spinner and/or show a window notification, then dismiss by id.

## [Show Status Bar](docs/status/showStatusBar.md)

Display a short, persistent message in the VS Code status bar, optionally with a spinner, to indicate ongoing work or state.

Basic usage:

```javascript
// mcp, server, and scope (optional filepath) are available in this context

const result = await mcp.dispatch('status.showStatusBar', {
  id: 'doc:generate',
  message: 'Generating documentation…'
});

console.log(result);
// -> { id: 'doc:generate', message: 'Generating documentation…', spinner: false, shown: true }
```

## [Show Status Window](docs/status/showStatusWindow.md)

Show a high-visibility window notification for important, time-bound events (e.g., build finished, tests failed).

Basic usage:

```javascript
// mcp, server, and scope are available in this context

const { id, message, shown } = await mcp.dispatch('status.showStatusWindow', {
  id: 'welcome',
  message: 'Hello! You’re ready to go.'
});
```

## [Dismiss Status](docs/status/dismissStatus.md)

Precisely remove any status (bar or window) by its id. Use it to stop spinners, close notifications, and keep the UI tidy.

Basic usage:

```javascript
// mcp, server, and scope (optional path) are available in this context.

const { dismissed, id } = await mcp.dispatch('status.dismissStatus', {
  id: 'build:spinner'
});
```