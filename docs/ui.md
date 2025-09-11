# UI Server MCP Documentation

This document describes the MCP UI Server, its available tools, and provides usage examples for each. The UI Server exposes tools for interacting with the VS Code user interface, including showing messages and prompting for input.

## Overview

The UI Server implements the following MCP tools:

- `ui.info`: Show info message with optional actions.
- `ui.warn`: Show warning message.
- `ui.input`: Prompt user for a string.

---

## Tool Reference & Examples

### 1. ui.info
**Description:** Show info message with optional actions.

**Schema:**
```json
{
  "message": "string",
  "actions": "string[]?"
}
```

**Example:**
```js
await mcp.call("ui.info", {
  message: "Operation completed successfully!",
  actions: ["OK", "Details"]
});
```

---

### 2. ui.warn
**Description:** Show warning message.

**Schema:**
```json
{
  "message": "string",
  "actions": "string[]?"
}
```

**Example:**
```js
await mcp.call("ui.warn", {
  message: "This action may overwrite existing data.",
  actions: ["Continue", "Cancel"]
});
```

---

### 3. ui.input
**Description:** Prompt user for a string.

**Schema:**
```json
{
  "prompt": "string",
  "placeHolder": "string?="
}
```

**Example:**
```js
const result = await mcp.call("ui.input", {
  prompt: "Enter your name:",
  placeHolder: "Name"
});
console.log(result.value);
```

---

## Notes
- All UI tools interact with the VS Code user interface and may require user action.
- Error handling is recommended for all agent code.
