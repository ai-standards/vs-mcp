# Create Terminal (terminal.createTerminal)

Spin up a new integrated terminal in VS Code without touching the UI. This tool is a thin, fast bridge from your code to VS Code’s terminal panel. It returns a stable terminalId you can use to show the terminal, send commands, and finally close it.

You’ll reach for this when you want to automate workflows: run scripts, kick off dev servers, tail logs, or prepare project-specific terminals on demand. It’s also handy when building higher-level features that need a shell without the user doing anything manually.

## What it does

- Creates a new integrated terminal.
- Optionally assigns a friendly name.
- Returns a terminalId you can use with other terminal tools:
  - terminal.showTerminal
  - terminal.sendTextToTerminal
  - terminal.closeTerminal
  - terminal.listTerminals

## Inputs and outputs

- Input
  - name: string (optional) — the terminal’s display name.
- Output
  - terminalId: string — identifier for this terminal session.

## Basic usage

Create a terminal and keep its id for later. Assume mcp, server, and scope are available in your environment.

```javascript
const { terminalId } = await mcp.dispatch('terminal.createTerminal', {
  // name is optional; VS Code will auto-name if omitted
});

// Use terminalId with other terminal tools later
```

## Name the terminal

Give the terminal a purpose-driven name. Names help when you create multiple terminals.

```javascript
const { terminalId } = await mcp.dispatch('terminal.createTerminal', {
  name: 'Build'
});
```

## Create and immediately show it

Create the terminal, then bring it to the foreground.

```javascript
const { terminalId } = await mcp.dispatch('terminal.createTerminal', {
  name: 'Server'
});

await mcp.dispatch('terminal.showTerminal', { terminalId });
```

## Create and send a command

Start a terminal and run a command right away.

```javascript
const { terminalId } = await mcp.dispatch('terminal.createTerminal', {
  name: 'Watch'
});

await mcp.dispatch('terminal.sendTextToTerminal', {
  terminalId,
  text: 'npm run dev'
});

await mcp.dispatch('terminal.showTerminal', { terminalId });
```

## Create multiple terminals and track them

Spin up a few terminals for different tasks and keep their ids.

```javascript
const build = await mcp.dispatch('terminal.createTerminal', { name: 'Build' });
const server = await mcp.dispatch('terminal.createTerminal', { name: 'Server' });
const tests = await mcp.dispatch('terminal.createTerminal', { name: 'Tests' });

await mcp.dispatch('terminal.sendTextToTerminal', {
  terminalId: build.terminalId,
  text: 'npm run build'
});

await mcp.dispatch('terminal.sendTextToTerminal', {
  terminalId: server.terminalId,
  text: 'npm run start'
});

await mcp.dispatch('terminal.sendTextToTerminal', {
  terminalId: tests.terminalId,
  text: 'npm test -- --watch'
});
```

## Verify the terminal exists

List terminals and confirm your newly created terminalId is present.

```javascript
const { terminalId } = await mcp.dispatch('terminal.createTerminal', {
  name: 'Checks'
});

const { terminals } = await mcp.dispatch('terminal.listTerminals', {});

if (terminals.includes(terminalId)) {
  await mcp.dispatch('terminal.showTerminal', { terminalId });
}
```

## Clean up: close the terminal

When you’re done, close it to keep the workspace tidy.

```javascript
const { terminalId } = await mcp.dispatch('terminal.createTerminal', {
  name: 'One-off'
});

// ...use the terminal...

await mcp.dispatch('terminal.closeTerminal', { terminalId });
```

## Pattern: create-or-reuse by name (lightweight)

VS Code allows multiple terminals with the same name. If you want to avoid that, you can keep your own map from name to terminalId.

```javascript
// Simple in-memory registry
const terminalsByName = new Map();

async function getOrCreateTerminal(name) {
  if (terminalsByName.has(name)) return terminalsByName.get(name);

  const { terminalId } = await mcp.dispatch('terminal.createTerminal', { name });
  terminalsByName.set(name, terminalId);
  return terminalId;
}

const buildTid = await getOrCreateTerminal('Build');
await mcp.dispatch('terminal.sendTextToTerminal', {
  terminalId: buildTid,
  text: 'npm run build'
});
```

## Notes

- Naming is optional; duplicate names are allowed. Track terminalId for precise control.
- terminalId is for the current session. Don’t persist it across VS Code restarts.
- Combine this tool with terminal.showTerminal, terminal.sendTextToTerminal, and terminal.closeTerminal to build robust terminal workflows.