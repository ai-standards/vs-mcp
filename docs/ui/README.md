# UI namespace

The ui namespace provides lightweight, in-editor interactions: info toasts, warnings, and quick text inputs. Use these tools to guide users through small decisions, collect a parameter, or surface status without building custom UI. They’re ideal for short, interrupt-friendly flows like “Proceed?”, “Name the branch”, or “Open logs”.

Because these tools resolve immediately with simple results, you can compose them into larger workflows: confirm an action, prompt for a value, then branch to editor, terminal, or version control actions. Keep messages concise and actions focused; when you need validation or multiline input, consider a richer pattern or follow-up tools.

## [ui.showInfoMessage](docs/ui/ui.showInfoMessage.md)

Show an information message with optional actions. Great for quick notifications and small decisions (“Open summary?”, “Push now?”). Returns the selected action label or null if dismissed.

Simple example

```javascript
const { choice } = await mcp.dispatch('ui.showInfoMessage', {
  message: 'Build completed successfully.'
});

// choice will be null because no actions were provided.
```

## [ui.showInputBox](docs/ui/ui.showInputBox.md)

Prompt the user for a short string. Perfect for collecting a branch name, commit message, file path, or any quick parameter. Returns the typed value or null if cancelled.

Simple example

```javascript
// given: mcp, server, scope
const { value } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'What topic do you want to write about?'
}, { server, scope });

if (value === null) {
  // user cancelled
  console.log('No input provided.');
} else {
  console.log('User topic:', value);
}
```

## [ui.showWarningMessage](docs/ui/ui.showWarningMessage.md)

Surface a prominent warning, optionally with buttons (e.g., “Retry”, “Open Settings”). Use it to call attention to risky operations or failures. Current schema returns a placeholder value (choice is null); treat it as a UI side-effect, not for branching.

Simple example

```javascript
// mcp: an instance of the MCP client
// server: the MCP server instance (not used directly here)
// scope: optional filepath/context string you may have available

const { choice } = await mcp.dispatch('ui.showWarningMessage', {
  message: 'Unsaved changes may be lost.'
});

// choice is null in this version of the API.
```