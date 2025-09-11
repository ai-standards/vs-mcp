# Editor Server MCP Documentation

This document describes the MCP Editor Server, its available tools and resources, and provides usage examples for each. The Editor Server exposes tools for interacting with the VS Code editor, including opening virtual documents and proposing edits, as well as resources for accessing the active file and selection.

## Overview

The Editor Server implements the following MCP tools:

- `editor.openVirtual`: Open a read-only virtual document with content.
- `editor.proposeEdits`: Show a diff and ask the user to apply changes.

It also provides the following resources:

- `editor.activeFile`: Get the active editor file (path, languageId, selection or full text).
- `editor.selection`: Get selection offsets and text for the active editor.

---

## Tool Reference & Examples

### 1. editor.openVirtual
**Description:** Open a read-only virtual document with content.

**Schema:**
```json
{
  "content": "string",
  "language": "string?='markdown'"
}
```

**Example:**
```js
await mcp.call("editor.openVirtual", {
  content: "# Welcome to MCP\nThis is a virtual document.",
  language: "markdown"
});
```

---

### 2. editor.proposeEdits
**Description:** Show a diff and ask the user to apply changes.

**Schema:**
```json
{
  "targetPath": "string",
  "newContent": "string",
  "title": "string?='Agent: Proposed edits'"
}
```

**Example:**
```js
await mcp.call("editor.proposeEdits", {
  targetPath: "/path/to/file.js",
  newContent: "// New file content...",
  title: "Review Proposed Changes"
});
```

---

## Resource Reference & Examples

### 1. editor.activeFile
**Description:** Get the active editor file (path, languageId, selection or full text).

**Example:**
```js
const file = await mcp.read("editor.activeFile");
console.log(file.path, file.languageId, file.text);
```

---

### 2. editor.selection
**Description:** Get selection offsets and text for the active editor.

**Example:**
```js
const selection = await mcp.read("editor.selection");
console.log(selection.start, selection.end, selection.text);
```

---

## Notes
- `editor.proposeEdits` requires the `editor.apply` scope in the MCP session.
- Virtual documents opened with `editor.openVirtual` are read-only and do not persist to disk.
- Error handling is recommended for all agent code.
