# Filesystem Server MCP Documentation

This document describes the MCP Filesystem Server, its available tools, and provides usage examples for each. The Filesystem Server exposes tools for reading, writing, listing, and finding files and directories within the workspace.

## Overview

The Filesystem Server implements the following MCP tools:

- `fs.readFile`: Read a UTF-8 file inside the workspace.
- `fs.writeFile`: Write a UTF-8 file inside the workspace (with confirmation).
- `fs.readDir`: List directory entries (name + kind).
- `fs.find`: Find files by glob (workspace relative).

---

## Tool Reference & Examples

### 1. fs.readFile
**Description:** Read a UTF-8 file inside the workspace.

**Schema:**
```json
{
  "path": "string"
}
```

**Example:**
```js
const result = await mcp.call("fs.readFile", {
  path: "src/index.js"
});
console.log(result.text);
```

---

### 2. fs.writeFile
**Description:** Write a UTF-8 file inside the workspace (with confirmation).

**Schema:**
```json
{
  "path": "string",
  "content": "string"
}
```

**Example:**
```js
const result = await mcp.call("fs.writeFile", {
  path: "src/newfile.txt",
  content: "Hello, MCP!"
});
console.log(result.ok, result.path);
```

---

### 3. fs.readDir
**Description:** List directory entries (name + kind).

**Schema:**
```json
{
  "dir": "string"
}
```

**Example:**
```js
const result = await mcp.call("fs.readDir", {
  dir: "src"
});
console.log(result.items); // [{ name, type }]
```

---

### 4. fs.find
**Description:** Find files by glob (workspace relative).

**Schema:**
```json
{
  "glob": "string",
  "maxResults": "number?=100"
}
```

**Example:**
```js
const result = await mcp.call("fs.find", {
  glob: "**/*.ts",
  maxResults: 10
});
console.log(result.files);
```

---

## Notes
- `fs.writeFile` requires the `fs.write` scope in the MCP session and user confirmation.
- All file and directory paths are resolved relative to the workspace root.
- Error handling is recommended for all agent code.
