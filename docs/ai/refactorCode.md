# Refactor Code (ai.refactorCode)

Refactor Code takes existing source code and rewrites it according to your instructions. You can guide the transformation with optional language and style hints. It’s ideal for modernizing legacy code, enforcing conventions, or applying focused refactors such as extracting functions or switching to async/await.

Use it when you want high‑leverage, instruction‑driven changes—without manually combing through files. Feed it a string of code and plain‑English directives. Optionally tell it the target language and style, then integrate the result back into your workspace.

- Namespace: **ai**
- Tool id: **ai.refactorCode**
- Inputs:
  - **code** (string, required): the original source.
  - **instructions** (string, required): what to change and how.
  - **language** (string, optional): target language, e.g., "typescript".
  - **style** (string, optional): style or conventions, e.g., "functional, ESLint:airbnb".
- Outputs:
  - **code** (string): the original code echo.
  - **instructions** (string): the instructions echo.
  - **language** (string, optional): resolved target language.
  - **style** (string, optional): resolved style.
  - **refactoredCode** (string, required): the transformed source.

In all examples below, you have:
- mcp: an instance you can call with mcp.dispatch(...)
- server: the MCP server instance (not strictly needed for dispatching)
- scope: an optional filepath you can use as context for the current target file


## Basic usage

Give the tool code and a clear instruction. Get back refactoredCode. Open it in a virtual document to inspect quickly.

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

// Preview the result without touching files
await mcp.dispatch('editor.openVirtual', {
  content: refactoredCode,
  language: 'typescript'
});
```


## Specify language and style

When the target language or conventions matter, pass language and style. This helps the refactor converge on exactly what you expect.

```javascript
const code = `
class User {
  constructor(name) { this.name = name }
  greet() { return "Hello " + this.name }
}
`;

const instructions = 'Use functional style, avoid classes, prefer pure functions.';
const language = 'javascript';
const style = 'functional, ESLint:airbnb, prefer-const, no-mutation';

const result = await mcp.dispatch('ai.refactorCode', {
  code,
  instructions,
  language,
  style
});

await mcp.dispatch('editor.openVirtual', {
  content: result.refactoredCode,
  language
});
```


## Refactor a file and propose edits

Read a file from the workspace, refactor it, then propose a diff back to the user. This is the safest path for applying changes.

```javascript
// Choose the target path: use `scope` if provided; otherwise pick one explicitly.
const targetPath = scope; // e.g., '/absolute/path/to/src/utils/math.js'
if (!targetPath) {
  await mcp.dispatch('ui.showInfoMessage', {
    message: 'No scope provided. Set `scope` to the file you want to refactor.'
  });
  // Optionally return here.
}

// Get the workspace root (first folder)
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = folders[0];

const { text: original } = await mcp.dispatch('fs.readFile', {
  path: targetPath,
  workspaceRoot
});

const instructions = 'Modernize to async/await where appropriate and remove callbacks.';
const language = 'javascript';

const { refactoredCode } = await mcp.dispatch('ai.refactorCode', {
  code: original,
  instructions,
  language
});

// Propose changes in a diff; the user approves or rejects
await mcp.dispatch('editor.proposeEdits', {
  targetPath,
  newContent: refactoredCode,
  title: 'Refactor: async/await modernization',
  workspaceRoot
});
```


## Apply a style overhaul across many files

Batch refactor a set of files matching a glob. This pattern lists files, refactors each, and proposes edits one by one.

```javascript
// Define your glob; refine to limit scope.
const glob = 'src/**/*.js';

const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = folders[0];

const { files } = await mcp.dispatch('workspace.listWorkspaceFiles', { glob });

for (const targetPath of files) {
  const { text: original } = await mcp.dispatch('fs.readFile', {
    path: targetPath,
    workspaceRoot
  });

  const { refactoredCode } = await mcp.dispatch('ai.refactorCode', {
    code: original,
    instructions: 'Enforce module syntax (ESM), remove default exports, and add JSDoc for public APIs.',
    language: 'javascript',
    style: 'ESM, no-default-export, JSDoc-public-apis'
  });

  await mcp.dispatch('editor.proposeEdits', {
    targetPath,
    newContent: refactoredCode,
    title: 'Refactor: ESM + JSDoc',
    workspaceRoot
  });
}
```


## Extract testability and generate tests

Refactor for testability, then generate tests using the testCode tool. This pairs structural improvement with coverage.

```javascript
const targetPath = scope; // e.g., '/abs/path/to/src/service/user-service.ts'
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = folders[0];

const { text: original } = await mcp.dispatch('fs.readFile', {
  path: targetPath,
  workspaceRoot
});

// 1) Refactor toward testable seams
const { refactoredCode } = await mcp.dispatch('ai.refactorCode', {
  code: original,
  instructions: 'Extract side effects behind interfaces and inject dependencies for testability.',
  language: 'typescript',
  style: 'SOLID, dependency-injection'
});

// 2) Propose the refactor
await mcp.dispatch('editor.proposeEdits', {
  targetPath,
  newContent: refactoredCode,
  title: 'Refactor: Extract seams for tests',
  workspaceRoot
});

// 3) Generate tests for the refactored code
const { tests } = await mcp.dispatch('ai.testCode', {
  code: refactoredCode,
  framework: 'jest',
  language: 'typescript'
});

// 4) Preview tests in a virtual doc (save as needed)
await mcp.dispatch('editor.openVirtual', {
  content: tests,
  language: 'typescript'
});
```


## Focused refactor recipes

- Extract function or module:
  - Instructions: "Extract utility function for <behavior>, keep public API stable."
  - Benefit: Reduces duplication and clarifies boundaries.

```javascript
const { refactoredCode } = await mcp.dispatch('ai.refactorCode', {
  code: `
export function process(items) {
  let total = 0;
  for (const it of items) total += it.price * (1 - it.discount);
  return Math.round(total);
}
`,
  instructions: 'Extract the discount calculation into a pure helper and write expressive names.',
  language: 'javascript',
  style: 'functional, pure, expressive-names'
});
```

- Adopt an architectural style:
  - Instructions: "Move side effects to adapters and keep core pure; introduce ports for I/O."
  - Benefit: Separates domain logic from infrastructure.

```javascript
const { refactoredCode } = await mcp.dispatch('ai.refactorCode', {
  code: `
import fs from 'fs';
export function loadConfig() {
  const raw = fs.readFileSync('./config.json', 'utf-8');
  return JSON.parse(raw);
}
`,
  instructions: 'Introduce a ConfigPort read method; inject it into the domain; no fs in core.',
  language: 'typescript',
  style: 'hexagonal-architecture'
});
```


## Practical guidance

- Be specific with instructions. Prefer "Convert callbacks to async/await, preserve behavior, keep signatures stable" over "make it better."
- Use language and style to constrain output. They steer naming, patterns, and formatting.
- Start in a virtual doc. Once satisfied, use editor.proposeEdits to apply changes safely.
- For large files or batches, refactor in chunks to make diffs reviewable.
- Validate behavior with tests (ai.testCode) after structural changes.


## Troubleshooting

- Output diverges from expectations:
  - Tighten instructions. Name concrete targets: patterns to use/avoid, APIs to keep.
  - Provide language and style to reduce ambiguity.

- Workspace operations fail:
  - Ensure you resolved workspaceRoot via workspace.listWorkspaceFolders.
  - Pass absolute targetPath values to fs.readFile and editor.proposeEdits.

- Language highlighting in virtual docs:
  - Set the language parameter in editor.openVirtual to match the target output (e.g., "typescript").

- Idempotency:
  - If you run multiple passes, adjust instructions so repeated runs don’t oscillate (e.g., “if not already X, then Y”).