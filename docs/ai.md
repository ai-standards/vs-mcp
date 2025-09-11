# AI Server MCP Documentation

This document describes the MCP (Model Context Protocol) AI server, its available tools, and provides usage examples for each. The AI server exposes a set of tools for text, data, image, and code generation, as well as code refactoring, testing, and documentation.

## Overview

The AI server implements the following MCP tools:

- `ai.generateText`: Generate plain text from a prompt.
- `ai.generateData`: Generate structured data (e.g., JSON) from a prompt.
- `ai.generateImages`: Generate images from a prompt.
- `ai.generateCode`: Generate code from a natural language prompt.
- `ai.refactorCode`: Refactor code based on instructions.
- `ai.testCode`: Generate unit tests for code.
- `ai.writeDocumentation`: Write or update documentation for code.

All tools require the `ai.generate` scope in the MCP session.

---

## Tool Reference & Examples

### 1. ai.generateText
**Description:** Generate plain text from a prompt.

**Schema:**
```json
{
  "prompt": "string",
  "maxTokens": "number?=600",
  "model": "string?",
  "temperature": "number?"
}
```

**Example:**
```js
const result = await mcp.call("ai.generateText", {
  prompt: "Write a short poem about the ocean."
});
console.log(result.text);
```

---

### 2. ai.generateData
**Description:** Generate structured data (e.g., JSON) from a prompt.

**Schema:**
```json
{
  "prompt": "string",
  "schema": "string?",
  "maxTokens": "number?=600",
  "model": "string?",
  "temperature": "number?"
}
```

**Example:**
```js
const result = await mcp.call("ai.generateData", {
  prompt: "Generate a list of three fictional planets with name and climate.",
  schema: "[{name:string, climate:string}]"
});
console.log(result.data);
```

---

### 3. ai.generateImages
**Description:** Generate images from a prompt.

**Schema:**
```json
{
  "prompt": "string",
  "count": "number?=1",
  "size": "string?='512x512'",
  "model": "string?"
}
```

**Example:**
```js
const result = await mcp.call("ai.generateImages", {
  prompt: "A futuristic city skyline at sunset",
  count: 2,
  size: "1024x1024"
});
console.log(result.images); // Array of image URLs
```

---

### 4. ai.generateCode
**Description:** Generate code from a natural language prompt.

**Schema:**
```json
{
  "prompt": "string",
  "language": "string?=typescript",
  "style": "string?='clean'",
  "maxTokens": "number?=600"
}
```

**Example:**
```js
const result = await mcp.call("ai.generateCode", {
  prompt: "Create a function that adds two numbers.",
  language: "javascript"
});
console.log(result.code);
```

---

### 5. ai.refactorCode
**Description:** Refactor code based on instructions.

**Schema:**
```json
{
  "code": "string",
  "instructions": "string",
  "language": "string?=typescript",
  "style": "string?='clean'"
}
```

**Example:**
```js
const result = await mcp.call("ai.refactorCode", {
  code: "function add(a, b) { return a + b }",
  instructions: "Add input validation"
});
console.log(result.code);
```

---

### 6. ai.testCode
**Description:** Generate unit tests for code.

**Schema:**
```json
{
  "code": "string",
  "framework": "string?=vitest",
  "language": "string?=typescript"
}
```

**Example:**
```js
const result = await mcp.call("ai.testCode", {
  code: "function add(a, b) { return a + b }"
});
console.log(result.tests);
```

---

### 7. ai.writeDocumentation
**Description:** Write or update documentation for code.

**Schema:**
```json
{
  "code": "string",
  "format": "string?='markdown'",
  "audience": "string?='developers'"
}
```

**Example:**
```js
const result = await mcp.call("ai.writeDocumentation", {
  code: "function add(a, b) { return a + b }"
});
console.log(result.docs);
```

---


## Example Agents for Each AI MCP Method

### ai.generateText
```js
export default async function agent({ mcp }) {
  const result = await mcp.call("ai.generateText", {
    prompt: "Write a motivational quote about teamwork."
  });
  await mcp.call("ui.info", { message: result.text });
}
```

### ai.generateData
```js
export default async function agent({ mcp }) {
  const result = await mcp.call("ai.generateData", {
    prompt: "List three startup ideas with name and description.",
    schema: "[{name:string, description:string}]"
  });
  await mcp.call("ui.info", { message: JSON.stringify(result.data, null, 2) });
}
```

### ai.generateImages
```js
export default async function agent({ mcp }) {
  const result = await mcp.call("ai.generateImages", {
    prompt: "A robot reading a book in a library",
    count: 1,
    size: "512x512"
  });
  await mcp.call("ui.info", { message: "Image URL: " + result.images[0] });
}
```

### ai.generateCode
```js
export default async function agent({ mcp }) {
  const result = await mcp.call("ai.generateCode", {
    prompt: "Create a function that reverses a string.",
    language: "javascript"
  });
  await mcp.call("editor.openVirtual", {
    content: result.code,
    language: "javascript"
  });
}
```

### ai.refactorCode
```js
export default async function agent({ mcp }) {
  const code = "function greet(name) { return 'Hello ' + name; }";
  const result = await mcp.call("ai.refactorCode", {
    code,
    instructions: "Make it return a greeting in uppercase."
  });
  await mcp.call("editor.openVirtual", {
    content: result.code,
    language: "javascript"
  });
}
```

### ai.testCode
```js
export default async function agent({ mcp }) {
  const code = "function add(a, b) { return a + b; }";
  const result = await mcp.call("ai.testCode", {
    code,
    framework: "vitest",
    language: "javascript"
  });
  await mcp.call("editor.openVirtual", {
    content: result.tests,
    language: "javascript"
  });
}
```

### ai.writeDocumentation
```js
export default async function agent({ mcp }) {
  const code = "function multiply(a, b) { return a * b; }";
  const result = await mcp.call("ai.writeDocumentation", {
    code,
    format: "markdown",
    audience: "developers"
  });
  await mcp.call("editor.openVirtual", {
    content: result.docs,
    language: "markdown"
  });
}
```

---

## Notes
- All AI tools require the `ai.generate` scope in the MCP session.
- For image generation, the returned value is an array of image URLs.
- For data generation, ensure the prompt and schema are clear to get valid JSON.
- Error handling is recommended for all agent code.
