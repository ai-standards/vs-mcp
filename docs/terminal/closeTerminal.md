# Close Terminal (terminal.closeTerminal)

Close Terminal lets you programmatically dispose a specific integrated terminal in VS Code. When you’re automating workflows that spawn terminals—running scripts, launching dev servers, or executing build steps—you’ll eventually want to cleanly tear them down. This tool does exactly that: given a terminalId, it closes that terminal.

Use it to tidy up after temporary terminals, enforce one-terminal-per-task policies, or implement “close all” commands in your automations. It pairs well with other terminal tools like Create Terminal, List Terminals, Send Text to Terminal, and Show Terminal.

## What it does

- Closes a specific integrated terminal identified by its terminalId.
- Returns a simple success flag so you can confirm the terminal was closed.

## When you might need it

- After a script finishes, automatically close its temporary terminal.
- Replace a long-running terminal with a fresh instance before a new task.
- Implement cleanup routines that close all open project terminals.

## API

- Namespace: terminal
- Tool ID: closeTerminal
- Description: Close a specific integrated terminal in VS Code.

Input
- terminalId: string (required)

Output
- success: boolean

Note: In schema, success is represented with a “false” type placeholder. Treat it as a boolean flag.

## Basic usage

You have mcp (client), server (connected MCP server), and scope (optional file/workspace path) available in all examples. Call the tool via mcp.dispatch.

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

## Variations

### Close a newly created terminal

Create it, do work, then close it. This is the safest way to ensure you have the correct terminalId.

```javascript
async function runTaskAndClose() {
  const { terminalId } = await mcp.dispatch('terminal.createTerminal', {
    name: 'temp-task'
  });

  // Show terminal and run a command
  await mcp.dispatch('terminal.showTerminal', { terminalId });
  await mcp.dispatch('terminal.sendTextToTerminal', {
    terminalId,
    text: 'echo "Running task" && sleep 1'
  });

  // Cleanup
  const { success } = await mcp.dispatch('terminal.closeTerminal', { terminalId });
  if (!success) {
    throw new Error(`Could not close terminal: ${terminalId}`);
  }
}

await runTaskAndClose();
```

### Close the first available terminal

List terminals, pick one, and close it. Useful for quick scripts.

```javascript
async function closeFirstTerminal() {
  const { terminals } = await mcp.dispatch('terminal.listTerminals', {});

  if (!terminals.length) {
    console.log('No terminals to close.');
    return;
  }

  const target = terminals[0];
  const { success } = await mcp.dispatch('terminal.closeTerminal', { terminalId: target });

  console.log(`Closed ${target}: ${success}`);
}

await closeFirstTerminal();
```

### Prompt the user for which terminal to close

List terminal IDs and let the user type one.

```javascript
async function promptAndClose() {
  const { terminals } = await mcp.dispatch('terminal.listTerminals', {});

  if (!terminals.length) {
    await mcp.dispatch('ui.showInfoMessage', { message: 'No open terminals.' });
    return;
  }

  const { value } = await mcp.dispatch('ui.showInputBox', {
    prompt: `Enter terminalId to close:\n${terminals.join('\n')}`
  });

  if (!value) {
    console.log('No terminal selected.');
    return;
  }

  const { success } = await mcp.dispatch('terminal.closeTerminal', { terminalId: value });
  console.log(`Closed ${value}: ${success}`);
}

await promptAndClose();
```

### Graceful shutdown: send "exit" before closing

Give the shell a chance to exit cleanly, then close.

```javascript
async function gracefulClose(terminalId) {
  await mcp.dispatch('terminal.sendTextToTerminal', {
    terminalId,
    text: 'exit'
  });

  // Some shells close themselves on "exit"; still attempt close to dispose VS Code terminal
  const { success } = await mcp.dispatch('terminal.closeTerminal', { terminalId });
  console.log(`Graceful close ${terminalId}: ${success}`);
}
```

### Close all terminals

Batch operation across every open terminal.

```javascript
async function closeAllTerminals() {
  const { terminals } = await mcp.dispatch('terminal.listTerminals', {});
  for (const terminalId of terminals) {
    const { success } = await mcp.dispatch('terminal.closeTerminal', { terminalId });
    console.log(`Closed ${terminalId}: ${success}`);
  }
}

await closeAllTerminals();
```

## Notes and good practices

- Always obtain terminalId from Create Terminal or List Terminals. Don’t guess.
- After closing, the terminalId becomes invalid. Further calls like sendTextToTerminal will fail.
- If closing might disrupt a user task, prompt for confirmation with UI tools before proceeding.
- Combine with Show Terminal when you want to bring a terminal to the foreground before closing (for user visibility).

## See also

- Create Terminal: terminal.createTerminal
- List Terminals: terminal.listTerminals
- Send Text to Terminal: terminal.sendTextToTerminal
- Show Terminal: terminal.showTerminal
- UI: ui.showInputBox, ui.showInfoMessage