# Managing terminals

The terminal MCPs provide programmatic control over VS Code’s integrated terminals. Use it to create, list, reveal, drive, and dispose terminals from your MCP workflows—no manual UI interaction required. This is ideal for automating builds and tests, spinning up dev servers, tailing logs, or coordinating multi-terminal tasks.

Why use it? It gives you reproducible, scriptable terminal operations you can compose: create a terminal, show it, send commands, then close it when you’re done. It’s especially useful for one-off task runners, project bootstrappers, and cleanup routines that keep workspaces tidy.

- Create new terminals and get stable IDs for subsequent actions
- Discover currently open terminals
- Bring a specific terminal to the foreground
- Send commands or input to any terminal
- Cleanly close terminals when finished

## [Create Terminal](docs/terminal/createTerminal.md)

Create a new integrated terminal and get back its terminalId for follow-up actions (show, send, close). Use it to bootstrap workflows without touching the UI.

Example:

```javascript
const { terminalId } = await mcp.dispatch('terminal.createTerminal', {
  // name is optional; VS Code will auto-name if omitted
});

// Use terminalId with other terminal tools later
```

## [List Terminals](docs/terminal/listTerminals.md)

Get a snapshot of all open integrated terminals. Returns an array of terminal IDs you can use with show, send text, or close. Great for discovery and state checks before acting.

Example:

```javascript
// given: const mcp = /* MCP client */; const server = /* MCP server */; const scope = /* optional filepath */;

const { terminals } = await mcp.dispatch('terminal.listTerminals', {});
console.log('Open terminals:', terminals);

if (terminals.length === 0) {
  console.log('No terminals are open.');
}
```

## [Show Terminal](docs/terminal/showTerminal.md)

Reveal a specific terminal by ID and bring it to the foreground. Use it to focus the right terminal before sending commands or to guide the user in multi-terminal flows.

Example:

```javascript
// mcp: an instance of the MCP client
// server: the MCP server instance (not used directly here)
// scope: optional filepath context you can use if relevant

const { value: terminalId } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Enter the terminal ID to show'
});

if (terminalId) {
  const { success } = await mcp.dispatch('terminal.showTerminal', { terminalId });
  if (!success) {
    await mcp.dispatch('ui.showWarningMessage', {
      message: `Could not show terminal: ${terminalId}`
    });
  }
}
```

## [Send Text to Terminal](docs/terminal/sendTextToTerminal.md)

Send text or commands into a specific terminal. Works with any shell and supports multiline strings. Use it to kick off builds, drive CLIs, or chain scripted operations.

Example:

```javascript
// You have: mcp (the MCP client instance), scope (optional filepath)
const knownTerminalId = 'your-terminal-id';

const result = await mcp.dispatch('terminal.sendTextToTerminal', {
  terminalId: knownTerminalId,
  text: 'npm run build'
});

if (!result.success) {
  throw new Error('Failed to send text to terminal');
}
```

## [Close Terminal](docs/terminal/closeTerminal.md)

Dispose a specific terminal by ID. Useful for cleanup after tasks, enforcing one-terminal-per-task, or implementing “close all” routines.

Example:

```javascript
// mcp: MCP client instance
// server: connected MCP server (not required in dispatch call here)
// scope: optional path context (not required for this tool)

async function closeById(terminalId) {
  const { success } = await mcp.dispatch('terminal.closeTerminal', {
    terminalId
  });

  if (!success) {
    throw new Error(`Failed to close terminal: ${terminalId}`);
  }
}

// Example: close a known terminal
await closeById('abc123');
```