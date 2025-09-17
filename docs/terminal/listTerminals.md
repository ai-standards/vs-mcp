# terminal.listTerminals

List Terminals gives you a fast snapshot of every open integrated terminal in VS Code. It returns an array of terminal identifiers you can feed into other terminal tools (show, send text, close). If you automate terminal workflows—running build scripts, toggling logs, or cleaning up stray shells—this is your entry point.

Use it when you need to:
- Discover what terminals are open before acting.
- Drive workflows across multiple terminals.
- Recover from state drift (e.g., a terminal was closed manually).

The tool is idempotent and has no inputs. It simply reports current state.

## API

- Namespace: terminal
- Dispatch: terminal.listTerminals
- Input: {}
- Output:
  - terminals: string[] — identifiers of currently open terminals.

Each string represents a terminal you can use with:
- terminal.showTerminal
- terminal.sendTextToTerminal
- terminal.closeTerminal

## Basic usage

Get all open terminals.

```javascript
// given: const mcp = /* MCP client */; const server = /* MCP server */; const scope = /* optional filepath */;

const { terminals } = await mcp.dispatch('terminal.listTerminals', {});
console.log('Open terminals:', terminals);

if (terminals.length === 0) {
  console.log('No terminals are open.');
}
```

## Variations

### Ensure there is at least one terminal

If none exist, create one and then list again. Useful for scripts that require a terminal to be present but don’t care which.

```javascript
// given: mcp, server, scope

let { terminals } = await mcp.dispatch('terminal.listTerminals', {});

if (terminals.length === 0) {
  const { terminalId } = await mcp.dispatch('terminal.createTerminal', { name: 'auto' });
  console.log('Created terminal:', terminalId);

  ({ terminals } = await mcp.dispatch('terminal.listTerminals', {}));
}

console.log('Terminals now:', terminals);
```

### Show the first terminal (if any)

Bring a terminal to the foreground so the user can see output immediately.

```javascript
// given: mcp, server, scope

const { terminals } = await mcp.dispatch('terminal.listTerminals', {});
if (terminals.length > 0) {
  const terminalId = terminals[0];
  await mcp.dispatch('terminal.showTerminal', { terminalId });
  console.log('Showing terminal:', terminalId);
} else {
  console.log('No terminals to show.');
}
```

### Prompt the user to pick a terminal by index, then send a command

Quick interactive flow using ui.showInputBox. The prompt shows indices so a plain input box is enough.

```javascript
// given: mcp, server, scope

const { terminals } = await mcp.dispatch('terminal.listTerminals', {});
if (terminals.length === 0) {
  console.log('No terminals open.');
} else {
  const menu = terminals.map((id, i) => `${i}: ${id}`).join('\n');
  const { value } = await mcp.dispatch('ui.showInputBox', {
    prompt: `Pick a terminal index and press Enter:\n${menu}`,
    placeHolder: 'e.g., 0'
  });

  const index = Number(value);
  if (Number.isInteger(index) && index >= 0 && index < terminals.length) {
    const terminalId = terminals[index];

    await mcp.dispatch('terminal.showTerminal', { terminalId });
    await mcp.dispatch('terminal.sendTextToTerminal', {
      terminalId,
      text: 'echo "Hello from MCP!"\n'
    });

    console.log('Sent text to:', terminalId);
  } else {
    console.log('Invalid selection.');
  }
}
```

### Create a terminal, verify it’s listed, then send text

End‑to‑end sanity check: create → list → use.

```javascript
// given: mcp, server, scope

const { terminalId: created } = await mcp.dispatch('terminal.createTerminal', { name: 'build' });

const { terminals } = await mcp.dispatch('terminal.listTerminals', {});
if (!terminals.includes(created)) {
  throw new Error('New terminal did not appear in the list.');
}

await mcp.dispatch('terminal.sendTextToTerminal', {
  terminalId: created,
  text: 'npm run build\n'
});
await mcp.dispatch('terminal.showTerminal', { terminalId: created });

console.log('Build started in terminal:', created);
```

### Close all terminals safely

When you want a clean slate.

```javascript
// given: mcp, server, scope

const { terminals } = await mcp.dispatch('terminal.listTerminals', {});
for (const terminalId of terminals) {
  try {
    await mcp.dispatch('terminal.closeTerminal', { terminalId });
    console.log('Closed terminal:', terminalId);
  } catch (err) {
    console.warn('Failed to close terminal:', terminalId, err);
  }
}
```

## Tips and practices

- Always handle the empty list. Terminal state changes outside your script.
- Refresh before acting. Call terminal.listTerminals right before show/send/close to avoid stale IDs.
- Compose tools. listTerminals is designed to pair with terminal.showTerminal, terminal.sendTextToTerminal, terminal.closeTerminal, and terminal.createTerminal.

## Related tools

- terminal.createTerminal — create a new integrated terminal.
- terminal.showTerminal — reveal a terminal UI by id.
- terminal.sendTextToTerminal — send commands or text to a terminal.
- terminal.closeTerminal — close a terminal by id.