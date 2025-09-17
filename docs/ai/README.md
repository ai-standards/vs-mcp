# AI Generation

The AI MCPs provides model-powered helpers for text, code, data, docs, and images—all wired for MCP workflows in VS Code. Use these tools to draft or refactor code, generate structured JSON, create documentation, synthesize images, or write plain text. Each tool returns predictable outputs that fit naturally with editor and workspace operations like openVirtual, proposeEdits, and createWorkspaceFile.

You might reach for ai tools when you want to scaffold code quickly, convert prompts into structured data, keep docs up to date, or automate content generation around your development flow. Dispatch them directly, chain results, and integrate with review-first editor actions for safe, iterative work.

Notes:
- Call tools via mcp.dispatch('<namespace>.<id>', input).
- Examples assume you have an initialized mcp client (and optionally server and scope).

## [ai.generateCode](docs/ai/generateCode.md)

Turn a natural-language prompt into runnable source code. Optionally specify a target language and style, and get back code you can preview, review, or save.

Example (basic usage):

```javascript
// assumes: mcp, server, scope
const { code, language } = await mcp.dispatch('ai.generateCode', {
  prompt: 'Create a function that debounces an input callback with a wait time in milliseconds.'
});

console.log(language); // e.g., "javascript"
console.log(code);
```

## [ai.generateData](docs/ai/generateData.md)

Generate predictable, machine-usable structures (like JSON) from a prompt. Optionally enforce shape with JSON Schema, control size/creativity, and target a model.

Example (basic usage):

```javascript
// Generate a concise product object without an explicit schema
const { data } = await mcp.dispatch(
  'ai.generateData',
  {
    prompt: 'Create a small product object with id, name, and price. Price as a number.'
  },
  { server, scope }
);

console.log(data);
```

## [ai.generateImages](docs/ai/generateImages.md)

Create images from a short text description. Optionally request multiple variations, set size, or choose a model. Returned payload depends on your backend (URLs, data URLs, base64).

Example (basic usage):

```javascript
const { images, prompt } = await mcp.dispatch('ai.generateImages', {
  prompt: 'A watercolor fox sitting under a maple tree, autumn palette'
});

console.log('Prompt:', prompt);
console.log('Got images:', images.length);
```

## [ai.generateText](docs/ai/generateText.md)

Generate freeform text from a prompt. Control length, creativity, and model as needed. Ideal for summaries, outlines, commit messages, and quick scaffolding.

Example (basic usage):

```javascript
// You have: mcp (client), server (the MCP server), scope (optional filepath)
const { text } = await mcp.dispatch('ai.generateText', {
  prompt: 'Explain JavaScript’s event loop in one concise paragraph.'
});

console.log(text);
```

## [ai.refactorCode](docs/ai/refactorCode.md)

Refactor existing source with plain-English instructions. Optionally guide the language and style. Great for modernizing code, enforcing conventions, and focused transformations.

Example (basic usage):

```javascript
// Basic refactor: convert to TypeScript and use arrow functions
const code = `
function add(a, b) {
  return a + b;
}
`;

const instructions = 'Convert to TypeScript, use arrow functions, and add explicit types.';

const { refactoredCode } = await mcp.dispatch('ai.refactorCode', {
  code,
  instructions
});

// Preview the result
await mcp.dispatch('editor.openVirtual', {
  content: refactoredCode,
  language: 'typescript'
});
```

## [ai.writeDocumentation](docs/ai/writeDocumentation.md)

Generate audience-appropriate documentation directly from source code. Choose the format (e.g., markdown, JSDoc) and audience; preview or save the results.

Example (basic usage):

```javascript
// You have: mcp, server, and optional scope (a filepath)
const code = `
export function sum(a, b) {
  return a + b;
}
`;

const { docs } = await mcp.dispatch('ai.writeDocumentation', {
  code,
  format: 'markdown',
  audience: 'API consumers'
});

await mcp.dispatch('editor.openVirtual', {
  content: docs,
  language: 'markdown'
});
```