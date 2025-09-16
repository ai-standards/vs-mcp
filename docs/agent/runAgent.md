# Run Agent (agent.runAgent)

Run an MCP agent and get its response back in your extension. You can point it at a specific agent file, or let the server choose a default. The tool returns whatever the agent produces: text, JSON, or a custom structure.

Use this when you want to:
- Execute an existing agent from your workspace.
- Capture its output and route it elsewhere (editor, file, terminal, etc.).
- Build workflows that chain agent execution with other tools.

The input is minimal—just an optional filepath. The output always includes a response and may include the resolved filepath.

## Tool signature

- Namespace: **agent**
- Id: **runAgent**
- Description: Execute an MCP agent and return its output.

Input:
- filepath (string, optional): Path to the agent to run.

Output:
- response (unknown, required): The agent’s output.
- filepath (string, optional): The filepath the server resolved and used.

## Basic usage

Call the tool with an optional filepath. If you already have a likely path in scope, pass it. Otherwise, omit it and let the server decide.

```javascript
// Assumptions available in all examples:
// - const mcp = /* your MCP client instance */
// - const server = /* the connected MCP server */
// - const scope = /* optional filepath string */

const { filepath, response } = await mcp.dispatch('agent.runAgent', {
  filepath: scope // or omit to use the default agent
});

// Do something with the response
console.log('Ran agent at:', filepath ?? '(server default)');
console.log('Agent response:', response);
```

## Prompt for a filepath, then run the agent

Prompt the user for a path and run the agent they choose.

```javascript
// const mcp = ...; const server = ...; const scope = ...

const { value: maybePath } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Enter agent filepath (leave blank for default):',
  placeHolder: scope || 'path/to/agent'
});

const { filepath, response } = await mcp.dispatch('agent.runAgent', {
  filepath: maybePath || scope // may be undefined
});

console.log('Used agent:', filepath ?? '(server default)');
console.log('Response:', response);
```

## Run the default agent (no filepath)

When you just want “the default agent” to run, omit the input field entirely.

```javascript
// const mcp = ...; const server = ...; const scope = ...

const { filepath, response } = await mcp.dispatch('agent.runAgent', {});
console.log('Default agent resolved to:', filepath ?? '(unknown)');
console.log('Response:', response);
```

## Show the agent’s response in a virtual editor

Responses can be any shape. Convert to a readable string and open it as a virtual document.

```javascript
// const mcp = ...; const server = ...; const scope = ...

const { filepath, response } = await mcp.dispatch('agent.runAgent', {
  filepath: scope
});

// Normalize unknown response to a string for display
const toText = (r) =>
  typeof r === 'string' ? r : JSON.stringify(r, null, 2);

await mcp.dispatch('editor.openVirtual', {
  content: `# Agent: ${filepath ?? 'default'}\n\n${toText(response)}`,
  language: 'markdown'
});
```

## Save the response to a workspace file

Persist the output to your repo so it can be reviewed and committed.

```javascript
// const mcp = ...; const server = ...; const scope = ...

const { filepath, response } = await mcp.dispatch('agent.runAgent', {
  filepath: scope
});

const toText = (r) =>
  typeof r === 'string' ? r : JSON.stringify(r, null, 2);

// Ask where to save
const { value: outPath } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Save agent response to (workspace-relative path):',
  placeHolder: 'artifacts/agent-output.md'
});

if (outPath) {
  await mcp.dispatch('workspace.createWorkspaceFile', {
    path: outPath,
    content: toText(response)
  });
}
```

## Wrap execution with status notifications

Give users immediate feedback while the agent runs.

```javascript
// const mcp = ...; const server = ...; const scope = ...

const statusId = 'run-agent:' + Date.now();

await mcp.dispatch('status.showStatusBar', {
  id: statusId,
  message: 'Running agent...',
  spinner: true
});

try {
  const { filepath, response } = await mcp.dispatch('agent.runAgent', {
    filepath: scope
  });

  await mcp.dispatch('status.showStatusWindow', {
    id: statusId,
    message: `Agent done: ${filepath ?? 'default'}`
  });

  console.log('Response:', response);
} finally {
  await mcp.dispatch('status.dismissStatus', { id: statusId });
}
```

## Handle unknown response types safely

Be defensive: the response can be text, objects, arrays, or null-like values.

```javascript
// const mcp = ...; const server = ...; const scope = ...

const { response } = await mcp.dispatch('agent.runAgent', { filepath: scope });

function asDisplay(r) {
  if (r == null) return '(no response)';
  if (typeof r === 'string') return r;
  try {
    return JSON.stringify(r, null, 2);
  } catch {
    return String(r);
  }
}

const pretty = asDisplay(response);
console.log(pretty);
```

## Tips

- If you pass a filepath, prefer workspace-relative paths unless your setup requires absolute paths.
- If you omit `filepath`, the server decides which agent to run. Capture the returned `filepath` if you need traceability.
- Always normalize the unknown `response` before further processing or display.