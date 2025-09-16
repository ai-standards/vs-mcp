# agent.createAgent — Generate new MCP agent

The agent.createAgent tool scaffolds a new MCP agent in your workspace. It writes a ready-to-edit source file and returns where it put it. Use it when you want to spin up a new agent quickly without hand-creating boilerplate.

You call it from the vs-mcp extension via mcp.dispatch using the agent namespace. Provide a description to document intent, and optionally a filepath to control where the file is created.

## Tool signature

- Namespace: agent
- Id: createAgent
- Path: src/tools/agent/create-agent.mcpx.ts
- Description: Generate a new MCP agent

```json
{
  "input": {
    "filepath": "string | undefined",
    "description": "string | undefined"
  },
  "output": {
    "filepath": "string | undefined",
    "description": "string | undefined",
    "code": null
  }
}
```

Notes:
- All fields are optional. For predictable results, set filepath explicitly.
- The code field is reserved and currently not used; file contents are written to disk.

## Inputs

- filepath (string, optional)
  - Where to create the agent file. Use a workspace-relative path (e.g., src/agents/myAgent.ts) or absolute if your setup requires it.
- description (string, optional)
  - A short description embedded alongside the generated agent (e.g., in comments or metadata).

## Outputs

- filepath (string, optional)
  - The resolved path of the generated file.
- description (string, optional)
  - Echo of the provided description (if any).
- code (null, optional)
  - Reserved; not populated.

## Basic usage

Often you’ll collect some context from the user first:

```ts
const { value } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'What topic do you want to write about?'
});
```

Then generate an agent using that as its description:

```ts
const result = await mcp.dispatch('agent.createAgent', {
  description: value ?? 'New agent'
});

console.log('Created agent at:', result?.filepath);
```

## Variations

### Minimal call (description only)

If you don’t care where the file goes (tool defaults apply), just pass a description.

```ts
await mcp.dispatch('agent.createAgent', {
  description: 'Summarizes issues and proposes fixes'
});
```

### Fully specified (explicit filepath and description)

Control exactly where the file is created.

```ts
await mcp.dispatch('agent.createAgent', {
  filepath: 'src/agents/triageAgent.ts',
  description: 'Analyzes bug reports and tags severity'
});
```

### Prompt for both fields

Collect a filename and a description from the user before creation.

```ts
const { value: file } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Agent file path (e.g., src/agents/reviewer.ts)'
});

const { value: desc } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'One-line description (what does this agent do?)'
});

const result = await mcp.dispatch('agent.createAgent', {
  filepath: file || undefined,
  description: desc || undefined
});

console.log(result);
```

### Handle results and errors

Always surface where the file landed; handle failures cleanly.

```ts
try {
  const res = await mcp.dispatch('agent.createAgent', {
    filepath: 'src/agents/reporter.ts',
    description: 'Compiles daily status reports'
  });

  if (!res?.filepath) {
    throw new Error('Tool did not return a filepath');
  }

  console.log(`Agent created: ${res.filepath}`);
} catch (err) {
  console.error('Failed to create agent:', err);
  // Consider prompting again or choosing a different path.
}
```

## Practical notes

- Prefer workspace-relative paths for portability.
- Ensure the parent directory exists before calling, or be ready to handle a failure if it doesn’t.
- If a file already exists at filepath, behavior is implementation-dependent. When in doubt, check or prompt before overwriting.
- The tool writes the file to disk; it does not return the generated source in output.code. Open the file by path if you need to inspect or modify it immediately after creation.