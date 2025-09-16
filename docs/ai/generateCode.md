# ai.generateCode — Generate Code from Natural Language

The ai.generateCode tool turns a plain-English prompt into runnable source code. You tell it what you want, optionally specify a target language and style, and it returns a code string with enough structure to drop into your project.

Use it to scaffold modules, prototype ideas, spin up examples, or fill in boilerplate when you know what you want but don’t want to type it all yourself. Pair it with editor and workspace tools to show, review, and save the result directly in VS Code.

## What this tool does

- Generates code from a natural language prompt.
- Accepts optional hints: target language, style, and token budget.
- Returns the generated code along with the resolved language and echo of your settings.

## When you’d reach for it

- You need a first pass implementation to iterate on.
- You’re scaffolding files or example snippets for documentation.
- You want consistent style across a codebase by nudging the generator with style hints.

## Input and output

```json
{
  "namespace": "ai",
  "id": "generateCode",
  "description": "Generate new code from a natural language prompt, specifying language and style.",
  "input": {
    "prompt": "string (required)",
    "language": "string (optional)",
    "style": "string (optional)",
    "maxTokens": "number (optional)"
  },
  "output": {
    "prompt": "string",
    "language": "string",
    "style": "string (optional)",
    "maxTokens": "number (optional)",
    "code": "string"
  }
}
```

- The tool will always return a resolved language string. If you don’t provide one, it’s inferred by the server or defaults per configuration.
- maxTokens is an upper bound on the size of the generated output.

## Basic usage

Generate code from a minimal prompt. The examples assume you’re in an async context, and that mcp, server, and scope (an optional filepath) are available.

```javascript
// assumes: mcp, server, scope
const { code, language } = await mcp.dispatch('ai.generateCode', {
  prompt: 'Create a function that debounces an input callback with a wait time in milliseconds.'
});

console.log(language); // e.g., "javascript" (resolved by the server)
console.log(code);     // paste into a file or open as a virtual document
```

## Specify a target language

Be explicit when you know your target. It reduces ambiguity and avoids cross-language surprises.

```javascript
// assumes: mcp, server, scope
const { code } = await mcp.dispatch('ai.generateCode', {
  prompt: 'Implement a binary search over a sorted array of numbers.',
  language: 'typescript'
});

// Optionally show in a read-only editor tab
await mcp.dispatch('editor.openVirtual', {
  content: code,
  language: 'typescript'
});
```

## Control the code style

Style hints can guide architecture or conventions. Use this to align with your codebase’s patterns.

```javascript
// assumes: mcp, server, scope
const { code } = await mcp.dispatch('ai.generateCode', {
  prompt: 'HTTP client wrapper with retry and exponential backoff.',
  language: 'javascript',
  style: 'functional, no classes, small pure helpers, JSDoc for public functions'
});

await mcp.dispatch('editor.openVirtual', {
  content: code,
  language: 'javascript'
});
```

## Constrain output length

When you only need a snippet or want to prevent long outputs, set maxTokens.

```javascript
// assumes: mcp, server, scope
const { code } = await mcp.dispatch('ai.generateCode', {
  prompt: 'Express middleware that logs method, path, and response time.',
  language: 'javascript',
  maxTokens: 300
});

console.log(code);
```

## Save the result to your workspace

Create a new file and write the generated code. scope can point to your target file, or fall back to a reasonable default.

```javascript
// assumes: mcp, server, scope
const targetPath = scope || 'src/generated/logger.ts';

const { code } = await mcp.dispatch('ai.generateCode', {
  prompt: 'A minimal Winston logger configured for JSON logs with levels and timestamps.',
  language: 'typescript',
  style: 'idiomatic Node.js'
});

// Create file with content (preserves workspace permissions)
await mcp.dispatch('workspace.createWorkspaceFile', {
  path: targetPath,
  content: code
});

// Open the file in the editor
await mcp.dispatch('editor.openFile', { path: targetPath });
```

## Propose edits to an existing file

Show a diff and ask the user to apply changes. This is ideal for review workflows.

```javascript
// assumes: mcp, server, scope
const targetPath = scope || 'src/utils/debounce.ts';

// Find a workspace root to satisfy propose-edits
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders');
const workspaceRoot = folders[0];

const { code } = await mcp.dispatch('ai.generateCode', {
  prompt: 'Rewrite debounce to be cancellable and flushable with TypeScript types.',
  language: 'typescript',
  style: 'functional, typed'
});

const { applied } = await mcp.dispatch('editor.proposeEdits', {
  targetPath,
  newContent: code,
  title: 'Refactor: cancellable + flushable debounce',
  workspaceRoot
});

if (!applied) {
  await mcp.dispatch('ui.showInfoMessage', {
    message: 'Changes were not applied.',
    actions: ['OK']
  });
}
```

## Generate, then document

Chain with ai.writeDocumentation to produce docs for the generated code.

```javascript
// assumes: mcp, server, scope
const { code, language } = await mcp.dispatch('ai.generateCode', {
  prompt: 'A queue with concurrency control and backpressure.',
  language: 'typescript',
  style: 'clean, small modules, JSDoc on externals'
});

const { docs } = await mcp.dispatch('ai.writeDocumentation', {
  code,
  format: 'markdown',
  audience: 'developers'
});

// Show both outputs
await mcp.dispatch('editor.openVirtual', {
  content: code,
  language
});
await mcp.dispatch('editor.openVirtual', {
  content: docs,
  language: 'markdown'
});
```

## Prompting tips

- Be specific about inputs, outputs, and edge cases. Example: “Include input validation and error types.”
- State architectural preferences in style: “functional”, “OOP with interfaces”, “React hooks, no classes”, “idiomatic Go”, etc.
- If you need tests or types, say so in the prompt.
- Keep prompts focused; large, multi-part prompts tend to produce bloated code. Split tasks if necessary.

## Troubleshooting

- Unexpected language: explicitly set the language parameter.
- Output too long or too short: adjust maxTokens upward or downward.
- Code doesn’t match your conventions: add concrete style guidance (lint rules, file structure expectations).
- Want to review before applying: always use editor.proposeEdits rather than direct writes.

## Summary

- ai.generateCode turns clear instructions into code, with optional language and style control.
- It returns the code and the resolved metadata, so you can display, review, or persist it.
- Combine it with editor and workspace tools for a smooth, review-first workflow.