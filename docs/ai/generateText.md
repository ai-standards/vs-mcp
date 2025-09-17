# AI · Generate Text (ai.generateText)

Generate plain, readable text from a prompt. Use it for summaries, outlines, commit messages, release notes, or any freeform content you need during development.

This tool is intentionally simple: you provide a prompt and optional generation settings; you get back a text string. It plays well with other tools: collect input via UI, write results to files, or commit messages—without leaving the MCP workflow.

## What it does

- Turns a natural-language prompt into text.
- Accepts optional controls for length, model, and creativity.
- Returns the generated text plus the effective parameters used.

## When to use it

- Draft a paragraph of documentation or comments.
- Summarize a diff or a file (after you read it via fs/editor tools).
- Generate a one-line or multi-line commit message before committing.
- Quickly scaffold content (e.g., issue descriptions).

## Inputs and outputs

- Input
  - prompt (string, required): The instruction or question.
  - maxTokens (number, optional): Upper bound on output length.
  - model (string, optional): Model identifier (depends on your configured provider).
  - temperature (number, optional): Creativity. Lower is more deterministic.

- Output
  - prompt, maxTokens, model, temperature: Echo of the request parameters.
  - text (string, required): The generated text.

## Basic usage

```javascript
// You have: mcp (client), server (the MCP server), scope (optional filepath)
const { text } = await mcp.dispatch('ai.generateText', {
  prompt: 'Explain JavaScript’s event loop in one concise paragraph.'
});

console.log(text);
```

## Interactive prompt → text (open as a virtual doc)

Capture the prompt from the user, generate text, and open it read-only in the editor.

```javascript
const { value } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'What would you like to generate?'
});
if (!value) return;

const { text } = await mcp.dispatch('ai.generateText', {
  prompt: value
});

await mcp.dispatch('editor.openVirtual', {
  content: text,
  language: 'markdown'
});
```

## Control length with maxTokens

Bound the response length when you need snappy output or tight UI.

```javascript
const { text } = await mcp.dispatch('ai.generateText', {
  prompt: 'Write a 3-bullet summary of this project.',
  maxTokens: 120
});
```

## Make it deterministic with temperature

Lower temperature reduces randomness—good for tests, CI, or reproducible docs.

```javascript
const { text } = await mcp.dispatch('ai.generateText', {
  prompt: 'Provide a crisp definition of “idempotent” in software.',
  temperature: 0
});
```

## Select a model (user-provided)

Let the user specify a model ID (names depend on your configured provider).

```javascript
const { value: model } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Model to use (optional):'
});

const { text } = await mcp.dispatch('ai.generateText', {
  prompt: 'Draft a release note summary in 5–7 lines.',
  ...(model ? { model } : {})
});
```

## Save generated text to a file

Use scope if provided; otherwise write to a default path.

```javascript
const targetPath = scope || 'notes/generated-summary.md';

const { text } = await mcp.dispatch('ai.generateText', {
  prompt: 'Create a README section explaining setup in 6–10 lines.'
});

await mcp.dispatch('workspace.create-file', {
  path: targetPath,
  content: text
});
```

## Generate a commit message and commit

Create a concise commit message and commit staged changes.

```javascript
const { text: message } = await mcp.dispatch('ai.generateText', {
  prompt: 'Write a single-line, imperative commit message for the staged changes. Keep it under 72 chars.'
});

await mcp.dispatch('vcs.commitChanges', { message });
```

## Capture the full response object

You often just need text, but you can access the full response if you want to log or chain parameters.

```javascript
const result = await mcp.dispatch('ai.generateText', {
  prompt: 'List three practical uses of dependency injection.'
});

// result has:
// {
//   prompt: string,
//   maxTokens?: number,
//   model?: string,
//   temperature?: number,
//   text: string
// }
```

## Tips

- Be specific in your prompt. State format and length expectations.
- Use maxTokens to keep responses tight in UI contexts.
- Set temperature low for consistency; raise it for creative variance.
- If you need structured output (e.g., JSON), use ai.generateData instead.
- Model identifiers are provider-specific; expose them via UI when possible.

## Troubleshooting

- Empty or truncated output: increase maxTokens or make the prompt more precise.
- Model not available: omit model to use the default, or provide a valid configured model ID.
- Inconsistent results: set temperature to 0–0.3.