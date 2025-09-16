# agent.listAgents — List all MCP agents in your project

The List Agents tool scans your workspace and returns the MCP agents it finds. Use it to discover what agents exist, build quick selection UIs, or chain into other tools (like running or editing an agent).

You’ll reach for this when you need an authoritative list of agents: to display a roster, filter and open one, or programmatically run a specific agent. It requires no custom input; the extension provides the context.

## What it does

- Enumerates all MCP agents available in the current project.
- Returns metadata for each agent: id, name, optional description, and path.
- Works with the active workspace via the extension’s input context (no manual plumbing).

## Signature

- Namespace: agent
- Tool id: listAgents
- Dispatch: agent.listAgents

Input
- None you need to provide. The extension injects the context.

Output
- agents: array of { id: string; name: string; description?: string; path?: string }

## Basic usage

You have mcp, server, and scope available in these examples. Call the tool and react to the result.

```javascript
const { agents } = await mcp.dispatch('agent.listAgents', {});

await mcp.dispatch('ui.showInfoMessage', {
  message: agents.length
    ? `Found ${agents.length} agent(s).`
    : 'No agents found.'
});
```

## Variations

### Show a readable roster

Summarize the list and surface it in a window notification.

```javascript
const { agents } = await mcp.dispatch('agent.listAgents', {});

const message = agents.length
  ? agents
      .map((a, i) => {
        const parts = [`${i + 1}. ${a.name} (${a.id})`];
        if (a.description) parts.push(`— ${a.description}`);
        if (a.path) parts.push(`@ ${a.path}`);
        return parts.join(' ');
      })
      .join('\n')
  : 'No agents found.';

await mcp.dispatch('status.showStatusWindow', {
  id: 'agents.roster',
  message
});
```

### Filter agents by name or id

Prompt for a query, filter locally, and show the results.

```javascript
const { value: query } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Filter agents by name or id (leave blank for all)'
});

const { agents } = await mcp.dispatch('agent.listAgents', {});

const filtered = !query
  ? agents
  : agents.filter(a =>
      [a.name, a.id]
        .filter(Boolean)
        .some(s => s.toLowerCase().includes(query.toLowerCase()))
    );

const message = filtered.length
  ? filtered.map((a, i) => `${i + 1}. ${a.name} (${a.id})`).join('\n')
  : 'No matching agents.';

await mcp.dispatch('status.showStatusWindow', {
  id: 'agents.filtered',
  message
});
```

### Open an agent’s source file

Let the user choose an agent by index and open its path in the editor.

```javascript
const { agents } = await mcp.dispatch('agent.listAgents', {});

if (!agents.length) {
  await mcp.dispatch('ui.showWarningMessage', { message: 'No agents to open.' });
} else {
  const list = agents.map((a, i) => `${i + 1}. ${a.name} (${a.id})`).join('\n');
  await mcp.dispatch('status.showStatusWindow', { id: 'agents.select', message: list });

  const { value: idxStr } = await mcp.dispatch('ui.showInputBox', {
    prompt: 'Enter agent number to open (blank to cancel)'
  });

  if (idxStr) {
    const idx = Number(idxStr) - 1;
    const agent = agents[idx];
    if (!agent) {
      await mcp.dispatch('ui.showWarningMessage', { message: 'Invalid selection.' });
    } else if (!agent.path) {
      await mcp.dispatch('ui.showWarningMessage', { message: 'This agent does not expose a file path.' });
    } else {
      await mcp.dispatch('editor.openFile', { path: agent.path });
    }
  }
}
```

### Run a selected agent

Pick an agent and run it using its file path.

```javascript
const { agents } = await mcp.dispatch('agent.listAgents', {});

if (!agents.length) {
  await mcp.dispatch('ui.showWarningMessage', { message: 'No agents to run.' });
} else {
  const list = agents.map((a, i) => `${i + 1}. ${a.name} (${a.id})`).join('\n');
  await mcp.dispatch('status.showStatusWindow', { id: 'agents.run', message: list });

  const { value: idxStr } = await mcp.dispatch('ui.showInputBox', {
    prompt: 'Enter agent number to run (blank to cancel)'
  });

  if (idxStr) {
    const idx = Number(idxStr) - 1;
    const agent = agents[idx];

    if (!agent) {
      await mcp.dispatch('ui.showWarningMessage', { message: 'Invalid selection.' });
    } else if (!agent.path) {
      await mcp.dispatch('ui.showWarningMessage', { message: 'This agent has no file path to run.' });
    } else {
      const { response } = await mcp.dispatch('agent.runAgent', {
        filepath: agent.path
      });

      await mcp.dispatch('openVirtual', {
        // If your environment exposes editor.openVirtual under editor namespace, use 'editor.openVirtual'
        // Some setups register it as 'editor.openVirtual'
        content: JSON.stringify(response, null, 2),
        language: 'json'
      });
    }
  }
}
```

### Create a new agent, then list again

Chain tools to keep the roster up to date.

```javascript
await mcp.dispatch('agent.createAgent', {
  filepath: scope, // optional: use scope as a hint for where to create
  description: 'Example agent created from docs'
});

const { agents } = await mcp.dispatch('agent.listAgents', {});
await mcp.dispatch('ui.showInfoMessage', {
  message: `You now have ${agents.length} agent(s).`
});
```

## Notes and tips

- No input required: Do not provide __self; the extension injects it.
- Path may be missing: Handle agents where path is undefined.
- Workspaces: Results come from the active workspace context. If you use multi-root workspaces, the extension’s context decides which root is scanned.
- Combine with other tools:
  - agent.createAgent to scaffold new agents.
  - agent.runAgent to execute one by path.
  - editor.openFile or editor.openVirtual to navigate or display output.
  - ui and status tools to build lightweight UIs without external dependencies.

## See also

- agent.createAgent — Generate a new MCP agent.
- agent.runAgent — Execute an agent by its file path.