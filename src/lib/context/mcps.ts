export const mcpContext = `
# VS-MCP Extension Context Summary

This document provides a concise summary of the available MCP servers, tools, and resources for Copilot context. Each function is briefly described for quick reference and agent development.

---

## AI Server
- **ai.generateText**: Generate plain text from a prompt.
	- \`prompt: string\` (required)
	- \`maxTokens: number\` (optional, default: 600)
	- \`model: string\` (optional)
	- \`temperature: number\` (optional)
- **ai.generateData**: Generate structured data (JSON) from a prompt and optional schema.
	- \`prompt: string\` (required)
	- \`schema: string\` (optional)
	- \`maxTokens: number\` (optional, default: 600)
	- \`model: string\` (optional)
	- \`temperature: number\` (optional)
- **ai.generateImages**: Generate images from a prompt (returns array of image URLs).
	- \`prompt: string\` (required)
	- \`count: number\` (optional, default: 1)
	- \`size: string\` (optional, default: '512x512')
	- \`model: string\` (optional)
- **ai.generateCode**: Generate code from a natural language prompt.
	- \`prompt: string\` (required)
	- \`language: string\` (optional, default: 'typescript')
	- \`style: string\` (optional, default: 'clean')
	- \`maxTokens: number\` (optional, default: 600)
- **ai.refactorCode**: Refactor code based on instructions.
	- \`code: string\` (required)
	- \`instructions: string\` (required)
	- \`language: string\` (optional, default: 'typescript')
	- \`style: string\` (optional, default: 'clean')
- **ai.testCode**: Generate unit tests for code.
	- \`code: string\` (required)
	- \`framework: string\` (optional, default: 'vitest')
	- \`language: string\` (optional, default: 'typescript')
- **ai.writeDocumentation**: Write or update documentation for code.
	- \`code: string\` (required)
	- \`format: string\` (optional, default: 'markdown')
	- \`audience: string\` (optional, default: 'developers')
- **ai.generateFile**: Generate a filename and file text from a prompt.
	- \`prompt: string\` (required)
	- \`model: string\` (optional)
	- \`maxTokens: number\` (optional, default: 800)
	- \`temperature: number\` (optional)

## Filesystem Server
- **fs.readFile**: Read a UTF-8 file inside the workspace.
	- \`path: string\` (required)
- **fs.writeFile**: Write a UTF-8 file inside the workspace (requires confirmation and \`fs.write\` scope).
	- \`path: string\` (required)
	- \`content: string\` (required)
- **fs.readDir**: List directory entries (name + kind) for a given directory.
	- \`dir: string\` (required)
- **fs.find**: Find files by glob pattern (workspace relative).
	- \`glob: string\` (required)
	- \`maxResults: number\` (optional, default: 100)

## Editor Server
- **editor.openVirtual**: Open a read-only virtual document with content.
	- \`content: string\` (required)
	- \`language: string\` (optional, default: 'markdown')
- **editor.proposeEdits**: Show a diff and ask the user to apply changes (requires \`editor.apply\` scope).
	- \`targetPath: string\` (required)
	- \`newContent: string\` (required)
	- \`title: string\` (optional, default: 'Agent: Proposed edits')
- **editor.activeFile**: Get the active editor file (path, languageId, selection or full text).
	- No parameters (returns file info)
- **editor.selection**: Get selection offsets and text for the active editor.
	- No parameters (returns selection info)

## Status Server
- **status.window**: Show a status message in a window notification.
	- \`id: string\` (required)
	- \`message: string\` (required)
- **status.bar**: Show a status message in the status bar. Optionally show a spinner.
	- \`id: string\` (required)
	- \`message: string\` (required)
	- \`spinner: boolean\` (optional)
- **status.dismiss**: Dismiss any status notification by id.
	- \`id: string\` (required)

## UI Server
- **ui.info**: Show info message with optional actions.
	- \`message: string\` (required)
	- \`actions: string[]\` (optional)
- **ui.warn**: Show warning message with optional actions.
	- \`message: string\` (required)
	- \`actions: string[]\` (optional)
- **ui.input**: Prompt user for a string.
	- \`prompt: string\` (required)
	- \`placeHolder: string\` (optional)

---

## Example Agent

\`\`\`js
export const metadata = {
  id: 'hello',
  name: 'Hello World',
  description: 'Greets the current user'
}

export const run = async({ mcp, scope }) => {
  mcp.call('status.bar', {
    message: 'Creating greeting',
    id: 'create',
    spinner: true
  })
  
  try {
    const message = await mcp.call('ai.generateText', {
      prompt: 'Create a short, friendly greeting for this vs-mcp extension user'
    })

    mcp.call('status.dismiss', {
      id: 'create'
    })

    await mcp.call("ui.info", {
      message: message.text
    });

  } catch (err) {
    // Best-effort friendly error surface
    const msg = err && typeof err === "object" && "message" in err ? err.message : String(err);
    try {
      await mcp.call("ui.error", { message: \`Agent error\` });
    } catch {
      // swallow to avoid unhandled rejections in extension host
      // (ui.error might not be available if the MCP server failed to init)
    }
  }
}
\`\`\`

---

For full details and schemas, see the individual documentation files in \`/docs\`.
`;