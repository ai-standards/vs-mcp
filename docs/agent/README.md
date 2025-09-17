# Managing agents

The agent MCPs gives you everything you need to scaffold, discover, and run MCP agents from the vs-mcp extension. Use it to quickly create new agents without boilerplate, enumerate all agents in your workspace, and execute one to capture its output.

Typical workflows include:
- Scaffolding a new agent, then opening or running it.
- Listing agents to build quick-pick UIs or chain into other tools.
- Running an agent and routing its response to the editor, a file, or a status window.

## [agent.createAgent](docs/agent/createAgent.md)

Generate a new MCP agent source file in your workspace. Provide a short description and optionally a filepath; the tool writes the file and returns where it put it. Ideal for spinning up agents quickly without hand-creating boilerplate.

Example (basic usage):

```ts
const { value } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'What topic do you want to write about?'
});

const result = await mcp.dispatch('agent.createAgent', {
  description: value ?? 'New agent'
});

console.log('Created agent at:', result?.filepath);
```

## [agent.listAgents](docs/agent/listAgents.md)

Scan your workspace and return the MCP agents it finds, including id, name, optional description, and path. Great for building selection UIs, opening an agent’s file, or chaining into agent.runAgent.

Example (basic usage):

```javascript
const { agents } = await mcp.dispatch('agent.listAgents', {});

await mcp.dispatch('ui.showInfoMessage', {
  message: agents.length
    ? `Found ${agents.length} agent(s).`
    : 'No agents found.'
});
```

## [agent.runAgent](docs/agent/runAgent.md)

Execute an MCP agent and get its response. Point it at a specific agent file or let the server choose a default. The tool returns the agent’s output and the filepath used (if resolved).

Example (basic usage):

```javascript
const { filepath, response } = await mcp.dispatch('agent.runAgent', {
  filepath: scope // or omit to use the default agent
});

console.log('Ran agent at:', filepath ?? '(server default)');
console.log('Agent response:', response);
```