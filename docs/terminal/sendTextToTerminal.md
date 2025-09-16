# terminal.sendTextToTerminal — Send Text to the Integrated Terminal

Send text or a shell command into a specific VS Code integrated terminal from your MCP workflow.

Use it when you want to:
- Kick off builds, tests, or dev servers from code.
- Drive an interactive CLI.
- Chain terminal operations alongside other MCP tools (create, show, close).

You address terminals by their id. If you don’t have one yet, create a terminal or list existing terminals first, then send text.

## What it does

- Sends the provided text to the target terminal.
- Works with any shell the terminal is running.
- Supports multiline strings; each newline is delivered to the terminal.

Inputs:
- terminalId (string, required) — target terminal id.
- text (string, required) — the exact text to send (may include newlines).

Output:
- success (boolean) — true if the text was dispatched to the terminal.

Tip: Terminals are ephemeral. If your target terminal was closed, create a new one and retry.

## Basic usage

Send a command to a known terminal id.

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

## Create a terminal, then send a command

Create a terminal if you don’t have one, optionally show it, then send text.

```javascript
// Create a new terminal
const { terminalId } = await mcp.dispatch('terminal.createTerminal', {
  name: 'dev'
});

// (Optional) Bring the terminal to the foreground
await mcp.dispatch('terminal.showTerminal', { terminalId });

// Send a command
await mcp.dispatch('terminal.sendTextToTerminal', {
  terminalId,
  text: 'npm start'
});
```

## Send to an existing terminal (pick one)

List terminals, choose one (first match or fallback), then send text.

```javascript
const { terminals } = await mcp.dispatch('terminal.listTerminals', {});

if (terminals.length === 0) {
  throw new Error('No terminals are open. Create one first.');
}

const terminalId = terminals[0];

await mcp.dispatch('terminal.sendTextToTerminal', {
  terminalId,
  text: 'echo "Hello from MCP"'
});
```

## Send multiline scripts

Send multiple commands at once by including newline characters.

```javascript
const { terminalId } = await mcp.dispatch('terminal.createTerminal', { name: 'setup' });

const script = [
  'cd server',
  'npm ci',
  'npm run build',
  'npm test'
].join('\n');

await mcp.dispatch('terminal.sendTextToTerminal', {
  terminalId,
  text: script
});
```

## Drive an interactive CLI

You can push follow-up input after starting an interactive process. Keep in mind you are not reading terminal output here—just sending input.

```javascript
const { terminalId } = await mcp.dispatch('terminal.createTerminal', { name: 'interactive' });

// Start an interactive tool
await mcp.dispatch('terminal.sendTextToTerminal', {
  terminalId,
  text: 'node' // starts the Node REPL
});

// Provide input lines
await mcp.dispatch('terminal.sendTextToTerminal', {
  terminalId,
  text: 'console.log("hi")'
});

// Exit
await mcp.dispatch('terminal.sendTextToTerminal', {
  terminalId,
  text: '.exit'
});
```

## Use the current file path (scope)

If your workflow provides scope as the current file path, you can pass it into the command text.

```javascript
// scope is an optional filepath you have in your context
const { terminalId } = await mcp.dispatch('terminal.createTerminal', { name: 'run-file' });

await mcp.dispatch('terminal.sendTextToTerminal', {
  terminalId,
  text: `node "${scope}"`
});
```

## Show, then send

If you want the terminal visible before sending, show it explicitly.

```javascript
const { terminals } = await mcp.dispatch('terminal.listTerminals', {});
const terminalId = terminals[0];

await mcp.dispatch('terminal.showTerminal', { terminalId });

await mcp.dispatch('terminal.sendTextToTerminal', {
  terminalId,
  text: 'git status'
});
```

## Error handling and guardrails

Wrap calls and verify success.

```javascript
try {
  const { terminalId } = await mcp.dispatch('terminal.createTerminal', { name: 'ops' });
  const res = await mcp.dispatch('terminal.sendTextToTerminal', {
    terminalId,
    text: 'npx eslint .'
  });

  if (!res.success) {
    throw new Error('sendTextToTerminal reported failure');
  }
} catch (err) {
  // Decide how you want to report errors (UI message, logs, etc.)
  await mcp.dispatch('ui.showWarningMessage', {
    message: `Terminal command failed: ${String(err)}`,
    actions: ['OK']
  });
}
```

## Close when you’re done

Tidy up if the terminal is temporary.

```javascript
const { terminalId } = await mcp.dispatch('terminal.createTerminal', { name: 'temp' });

await mcp.dispatch('terminal.sendTextToTerminal', {
  terminalId,
  text: 'echo "work complete"'
});

// Close it
await mcp.dispatch('terminal.closeTerminal', { terminalId });
```

## Practical notes

- The text is sent as-is. Use '\n' to submit multiple lines.
- Prefer cross-platform commands (npm scripts, npx) to avoid shell differences.
- If the terminal is not visible, the command still runs. Call showTerminal when visibility matters.

## See also

- terminal.createTerminal — create a new terminal.
- terminal.listTerminals — enumerate available terminal ids.
- terminal.showTerminal — focus and reveal a terminal.
- terminal.closeTerminal — close a terminal.