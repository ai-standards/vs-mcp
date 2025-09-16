# Show Terminal (terminal.showTerminal)

The Show Terminal tool brings a specific integrated terminal to the foreground in VS Code. It does not create a terminal or send any text—its job is purely to reveal the terminal you specify by ID.

Use it when you need to:
- Focus a terminal before sending commands.
- Switch the user’s attention to the right terminal in multi-terminal workflows.
- Build quick pickers or automations that navigate between terminals.

It pairs well with:
- terminal.createTerminal (to create a terminal and then show it)
- terminal.listTerminals (to discover IDs to show)
- terminal.sendTextToTerminal (to reveal then run commands)
- terminal.closeTerminal (to manage lifecycle)

## Tool reference

- Namespace: terminal
- Command: terminal.showTerminal
- Input:
  - terminalId: string (required)
- Output:
  - success: boolean

Note: terminalId is session-scoped. IDs change between VS Code restarts.

## Basic usage

Prompt the user for a terminal ID, then show it.

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

## List terminals, then show one

List existing terminals and reveal the first available one. This is useful when you don’t already know the ID.

```javascript
const { terminals } = await mcp.dispatch('terminal.listTerminals', {});

if (terminals.length === 0) {
  await mcp.dispatch('ui.showInfoMessage', { message: 'No terminals are open.' });
} else {
  const terminalId = terminals[0];
  const { success } = await mcp.dispatch('terminal.showTerminal', { terminalId });

  if (!success) {
    await mcp.dispatch('ui.showWarningMessage', {
      message: `Failed to show terminal: ${terminalId}`
    });
  }
}
```

## Create a terminal, then reveal it

When you need a fresh terminal and want it visible immediately.

```javascript
const { terminalId } = await mcp.dispatch('terminal.createTerminal', {
  name: 'Build'
});

await mcp.dispatch('terminal.showTerminal', { terminalId });
```

## Reveal before sending text

Bringing the terminal to the foreground improves UX and avoids confusion when sending commands.

```javascript
// Assume you already have a terminalId (from create or list)
await mcp.dispatch('terminal.showTerminal', { terminalId });

const { success } = await mcp.dispatch('terminal.sendTextToTerminal', {
  terminalId,
  text: 'npm run build\n'
});

if (!success) {
  await mcp.dispatch('ui.showWarningMessage', { message: 'Failed to send text to terminal.' });
}
```

## Show or create fallback

If revealing fails or no terminals exist, create one and show it.

```javascript
const { terminals } = await mcp.dispatch('terminal.listTerminals', {});
let terminalId = terminals[0];

let shown = false;
if (terminalId) {
  const out = await mcp.dispatch('terminal.showTerminal', { terminalId });
  shown = out.success;
}

if (!shown) {
  const created = await mcp.dispatch('terminal.createTerminal', { name: 'Tasks' });
  terminalId = created.terminalId;

  const { success } = await mcp.dispatch('terminal.showTerminal', { terminalId });
  if (!success) {
    await mcp.dispatch('ui.showWarningMessage', { message: 'Could not reveal the new terminal.' });
  }
}
```

## Cycle through terminals (round-robin)

Quickly iterate through all open terminals and bring each to the front. Handy for dashboards or quick reviews.

```javascript
const { terminals } = await mcp.dispatch('terminal.listTerminals', {});

for (const terminalId of terminals) {
  const { success } = await mcp.dispatch('terminal.showTerminal', { terminalId });
  if (!success) {
    await mcp.dispatch('ui.showWarningMessage', {
      message: `Could not show terminal: ${terminalId}`
    });
  }
  // Optional: wait briefly so the user can see each one
  await new Promise(r => setTimeout(r, 500));
}
```

## Notes and tips

- Show Terminal reveals only; it doesn’t create or select by name. Use terminal.createTerminal and terminal.listTerminals to manage IDs.
- Always check the returned success flag. If it’s false, the ID may be stale or the terminal was closed.
- Combine with UI tools (ui.showInputBox, ui.showInfoMessage) to build interactive flows quickly.
- For background on VS Code terminals, see the [Integrated Terminal docs](https://code.visualstudio.com/docs/editor/integrated-terminal).