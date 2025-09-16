# ai.generateData — Generate Structured Data

The ai.generateData tool turns messy prompts into predictable, machine-usable structures. Think “give me JSON that matches this shape,” or “extract these fields from text and return a typed object.” If you’ve ever wrangled brittle string parsing or wished a model would stop improvising formats, this is your fix.

Use it to:
- Produce JSON objects and arrays from natural language.
- Enforce a shape with a schema.
- Extract data from source files or docs into structured records.
- Generate datasets and config files you can drop directly into your codebase.

Under the hood, you give it a prompt and optionally a schema. It returns your echo’d inputs plus a data payload you can rely on.

## What this tool provides

- Namespace: **ai**
- Id: **generateData**
- Description: Generate structured data (e.g., JSON) from a prompt and optional schema.
- Inputs:
  - **prompt** (string, required): What to generate or extract.
  - **schema** (string, optional): JSON Schema as a string. Use JSON.stringify to pass it.
  - **maxTokens** (number, optional): Upper-bound the response size.
  - **model** (string, optional): Model identifier (depends on your MCP AI provider).
  - **temperature** (number, optional): Lower is more deterministic.
- Output:
  - Echo of prompt, schema, maxTokens, model, temperature.
  - **data** (any, required): The structured result.

All examples assume you have:
- mcp: an initialized MCP client
- server: your MCP server instance/identifier
- scope: an optional filepath (string) you can pass along

Always call tools via mcp.dispatch.

## Basic usage

Ask for structured data with only a prompt. The tool will infer a reasonable structure.

```javascript
// Generate a concise product object without an explicit schema
const { data } = await mcp.dispatch(
  'ai.generateData',
  {
    prompt: 'Create a small product object with id, name, and price. Price as a number.'
  },
  { server, scope }
);

// Example shape (varies by model):
// data => { id: "sku_123", name: "Wireless Mouse", price: 24.99 }
console.log(data);
```

## Enforce a shape with a JSON Schema

Provide a schema to force key names, types, and required fields. Pass the schema as a string.

```javascript
const userSchema = JSON.stringify({
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    roles: {
      type: 'array',
      items: { type: 'string' }
    }
  },
  required: ['id', 'name', 'email', 'roles'],
  additionalProperties: false
});

const { data } = await mcp.dispatch(
  'ai.generateData',
  {
    prompt: 'Generate a valid user record. Keep it realistic but minimal.',
    schema: userSchema
  },
  { server, scope }
);

// Guaranteed to match the schema (to the extent the model complies).
console.log(data);
```

## Generate arrays and nested objects

Ask for collections and nested structures by encoding that intent in the schema.

```javascript
const inventorySchema = JSON.stringify({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      sku: { type: 'string' },
      name: { type: 'string' },
      price: { type: 'number' },
      tags: {
        type: 'array',
        items: { type: 'string' }
      },
      stock: {
        type: 'object',
        properties: {
          warehouse: { type: 'string' },
          quantity: { type: 'integer' }
        },
        required: ['warehouse', 'quantity'],
        additionalProperties: false
      }
    },
    required: ['sku', 'name', 'price', 'stock'],
    additionalProperties: false
  }
});

const { data } = await mcp.dispatch(
  'ai.generateData',
  {
    prompt: 'Create 3 sample inventory items for a hardware store.',
    schema: inventorySchema
  },
  { server, scope }
);

console.log(Array.isArray(data), data.length); // true, 3
```

## Control creativity and size

Tighten output with temperature and limit size with maxTokens. Select a specific model if needed.

```javascript
const { data } = await mcp.dispatch(
  'ai.generateData',
  {
    prompt: 'Produce a config object for a service with host, port, and retries.',
    schema: JSON.stringify({
      type: 'object',
      properties: {
        host: { type: 'string' },
        port: { type: 'integer' },
        retries: { type: 'integer' }
      },
      required: ['host', 'port', 'retries'],
      additionalProperties: false
    }),
    temperature: 0.1,     // more deterministic
    maxTokens: 200,       // keep it compact
    model: 'gpt-4o'       // example; use a model your provider supports
  },
  { server, scope }
);

console.log(data);
```

## Extract structured data from a file

Read a file via MCP, then convert it to structured data. This example extracts TODO items into an array.

```javascript
// Find a workspace root
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {}, { server, scope });
const workspaceRoot = folders?.[0];

// Choose a file: prefer scope, otherwise default to README.md
const path = scope || `${workspaceRoot}/README.md`;

// Read file content
const { text } = await mcp.dispatch(
  'fs.readFile',
  { path, workspaceRoot },
  { server, scope }
);

// Extract TODOs into a structured list
const todoSchema = JSON.stringify({
  type: 'array',
  items: {
    type: 'object',
    properties: {
      line: { type: 'integer' },
      text: { type: 'string' },
      owner: { type: 'string' }
    },
    required: ['line', 'text'],
    additionalProperties: false
  }
});

const { data: todos } = await mcp.dispatch(
  'ai.generateData',
  {
    prompt: `From the following file content, extract TODOs as { line, text, owner? }:\n\n${text}`,
    schema: todoSchema,
    temperature: 0.2
  },
  { server, scope }
);

console.log(todos);
```

## Persist results to the workspace

Write generated data directly as a file you can commit.

```javascript
const filename = 'generated.user.json';

const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {}, { server, scope });
const workspaceRoot = folders?.[0];
const outPath = scope || `${workspaceRoot}/${filename}`;

// Create a sample user object
const { data: user } = await mcp.dispatch(
  'ai.generateData',
  {
    prompt: 'Generate a minimal user: id (string), name (string), email (email).',
    schema: JSON.stringify({
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string', format: 'email' }
      },
      required: ['id', 'name', 'email'],
      additionalProperties: false
    }),
    temperature: 0
  },
  { server, scope }
);

// Create the file in the workspace
await mcp.dispatch(
  'workspace.createWorkspaceFile',
  { path: outPath, content: JSON.stringify(user, null, 2) },
  { server, scope }
);
```

## Validate and handle errors

The tool aims to follow your schema, but you should still check the result shape in critical paths.

```javascript
try {
  const schema = JSON.stringify({
    type: 'object',
    properties: { version: { type: 'string' }, features: { type: 'array', items: { type: 'string' } } },
    required: ['version', 'features'],
    additionalProperties: false
  });

  const { data } = await mcp.dispatch(
    'ai.generateData',
    {
      prompt: 'Create a release manifest with a semantic version and a short list of features.',
      schema,
      temperature: 0.2,
      maxTokens: 300
    },
    { server, scope }
  );

  if (
    typeof data !== 'object' ||
    data === null ||
    typeof data.version !== 'string' ||
    !Array.isArray(data.features)
  ) {
    throw new Error('Unexpected data shape');
  }

  console.log('Manifest OK:', data);
} catch (err) {
  // Decide: retry with lower temperature, tighten schema, or surface to user
  console.error('Failed to generate valid data:', err);
}
```

## Practical prompts that work

- “Return a minimal object for configuring an HTTP client with baseUrl, timeoutMs, and headers.”
- “Summarize these changelog entries into an array of { issueId, title, type }.”
- “Extract CLI flags and defaults from this README into an array of { flag, type, default, description }.”

Keep prompts direct. State types. Use a schema whenever the format matters.

## Tips

- Prefer a schema when you need strong guarantees. It reduces format drift.
- Lower temperature (0–0.3) for repeatable structures; raise it for variety in sample data.
- Use maxTokens to cap payloads for large arrays or nested objects.
- Start small. Ask for fewer fields, then iterate.
- Set additionalProperties: false to avoid extra fields creeping in.

## See also

- ai.generateText — plain text generation.
- ai.generateCode — code generation from prompts.
- workspace.createWorkspaceFile — write outputs to the repo.
- fs.readFile — feed source text to the model for extraction.

If you need general MCP basics, see the extension’s README or your server’s provider docs.