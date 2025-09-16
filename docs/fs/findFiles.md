# Find Files (fs.findFiles)

Find Files locates files in your workspace using a glob pattern. It’s fast, workspace-aware, and returns clean, relative paths you can feed directly into other tools.

Use it when you need to:
- Gather inputs for code generation, refactoring, or tests.
- Build quick file inventories (e.g., all Markdown docs, all unit tests).
- Pipe file lists into follow-up steps like reading, editing, or proposing changes.

## API

- Tool: fs.findFiles
- Description: Find files by glob pattern (workspace relative).
- Input:
  - glob: string (optional) — a glob like "src/**/*.ts"
  - maxResults: number (optional) — cap the number of returned paths
- Output:
  - files: string[] — workspace-relative file paths

Notes:
- Paths are workspace-relative; pair them with a workspace root when needed by other tools.
- Omitting glob searches with the tool’s default matcher (typically “everything”).

## Examples

All examples assume the following are available:
- mcp: the MCP client
- mcpServer: your MCP server instance
- scope: an optional filepath you may have on hand

### Basic usage: find Markdown files anywhere

Find all Markdown files in the workspace.

```javascript
// given: mcp, mcpServer, scope (optional filepath)

const { files } = await mcp.dispatch('fs.findFiles', {
  glob: '**/*.md'
});

console.log(files); // ['README.md', 'docs/guide.md', ...]
```

### No glob: list everything

If you omit glob, the tool uses its default matcher to return files across the workspace. Use maxResults to avoid flooding your UI.

```javascript
// given: mcp, mcpServer, scope

const { files } = await mcp.dispatch('fs.findFiles', {});
console.log(files.length, 'files total');
```

### Limit results

Cap the number of returned files with maxResults.

```javascript
// given: mcp, mcpServer, scope

const { files } = await mcp.dispatch('fs.findFiles', {
  glob: 'src/**/*.ts',
  maxResults: 50
});

console.log(files); // up to 50 TypeScript files under src/
```

### Search a specific subfolder

Target a folder and extension pattern with a precise glob.

```javascript
// given: mcp, mcpServer, scope

const { files } = await mcp.dispatch('fs.findFiles', {
  glob: 'tests/**/*.spec.ts'
});

console.log(files); // e.g., ['tests/unit/foo.spec.ts', ...]
```

### Chain with other tools: read the first matched file

Combine results with workspace roots and read the file content using fs.readFile.

```javascript
// given: mcp, mcpServer, scope

// 1) Find some files
const { files } = await mcp.dispatch('fs.findFiles', {
  glob: '**/*.md',
  maxResults: 10
});

// 2) Obtain a workspace root
const { folders } = await mcp.dispatch('workspace.listWorkspaceFolders', {});
const workspaceRoot = folders[0]; // pick the primary root

if (files.length > 0 && workspaceRoot) {
  // 3) Read the first file
  const { text } = await mcp.dispatch('fs.readFile', {
    path: files[0],          // workspace-relative from findFiles
    workspaceRoot            // absolute workspace root
  });

  console.log(text.slice(0, 200));
}
```

### Prompt the user for a pattern, then search

Collect a glob pattern interactively and run the search.

```javascript
// given: mcp, mcpServer, scope

const { value: glob } = await mcp.dispatch('ui.showInputBox', {
  prompt: 'Enter a workspace-relative glob (e.g., src/**/*.ts)'
});

if (glob) {
  const { files } = await mcp.dispatch('fs.findFiles', { glob, maxResults: 100 });
  console.log(`Found ${files.length} files for "${glob}"`);
}
```

### Multiple patterns: merge unique results

Call the tool multiple times and de-duplicate.

```javascript
// given: mcp, mcpServer, scope

const patterns = ['src/**/*.ts', 'tests/**/*.ts'];

const results = await Promise.all(
  patterns.map(glob => mcp.dispatch('fs.findFiles', { glob }))
);

const files = [...new Set(results.flatMap(r => r.files))];
console.log(files);
```

## Practical glob recipes

- All JS files anywhere: **/*.js
- All files at workspace root: *
- All tests under src: src/**/*.test.ts
- A specific file: README.md

## Tips

- Be specific with globs to reduce noise and speed up searches.
- Use maxResults to keep large workspaces responsive.
- Handle the empty case: files may be [] if nothing matches.
- When passing results to tools that need absolute roots (e.g., fs.readFile), pair each relative file path with a workspace root from workspace.listWorkspaceFolders.