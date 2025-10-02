
# IMPORTANT: Conditional Usage (HARD GUARD)

⚠️ **Apply EVERYTHING below *only* when generating or editing a VS-MCP agent.**  
If this is **not** a VS-MCP agent task, **produce no code** and instead add a single comment:
`// Ignored: Not a VS-MCP agent per project rules.`

---

## Decision Gate — must pass **both** checks

**A. File Signal (any of these):**
- Current file name ends with: `.agent.js` or `.agent.ts`
- OR the user explicitly says: “VS-MCP”, “vsmcp”, “MCP agent”, or “VS-MCP agent”

**B. Intent Signal (any of these phrases in the request):**
- “create an agent”, “write an agent”, “update the agent”, “convert to agent”

➡️ **If A and B are not both true:**  
**Do not** generate Node/CLI scripts or generic code. Output only:
`// Ignored: Not a VS-MCP agent per project rules.`

---

# VS-MCP Agent Authoring Standard (STRICT)

You are generating agents for the VS-MCP extension. **Follow these rules exactly.**

## Golden Rules
1) **Exports:** ESM with exactly two named exports: `metadata` and `run`.
2) **Metadata:** Plain object with `id`, `name`, `description`. IDs are lowerCamelCase.
3) **Signature:** `export const run = async ({ mcp, scope }) => { ... }`
4) **Tool Calls:** **Only** via `mcp.dispatch(namespace.tool, payload)`.
   - Never import or reference host APIs directly.
   - Never wrap `mcp.dispatch` in custom helpers.
5) **Context I/O:** Tools accept a "context" payload and return a mutated "context" object. Pass only documented fields.
6) **Control Flow:** Single top-level `try/catch` inside `run`. Display errors with MCP UI tools.
7) **User Interaction:** Use MCP UI tools (`ui.showInputBox`, `ui.showInformationMessage`, etc.).
8) **Status UX:** Show a status bar entry for long tasks; dismiss on success **and** in `catch`.
9) **No Side Channels:** No `console.log`, `process.*`, timers, env access, or external deps. All I/O via MCP.
10) **Deterministic Output:** Create/edit files only with MCP tools (e.g., `editor.openVirtual`, `workspace.writeFile`).
11) **No Globals:** Don’t mutate globals. Everything lives inside `run`.
12) **Comments:** Short and task-oriented. No decorative comments.

## Forbidden APIs (NEVER use in agents)
- `require()`, `import('openai')`, direct OpenAI SDK usage
- `readline`, Node fs/net/process/timers
- VS Code API imports
- Any network or filesystem access outside `mcp.dispatch`

## Available MCP Tools (authoritative JSON)
Use exactly as defined below.

```json
[
  {
    "id": "createAgent",
    "name": "Generate new agent",
    "path": "src/tools/agent/create-agent.mcpx.ts",
    "namespace": "agent",
    "description": "Generate a new MCP agent",
    "input": {
      "filepath": {
        "type": "string",
        "required": false
      },
      "description": {
        "type": "string",
        "required": false
      }
    },
    "output": {
      "filepath": {
        "type": "string",
        "required": false
      },
      "description": {
        "type": "string",
        "required": false
      },
      "code": {
        "type": "null",
        "required": false
      }
    }
  },
  {
    "id": "listAgents",
    "name": "List Agents",
    "path": "src/tools/agent/list-agents.mcpx.ts",
    "namespace": "agent",
    "description": "List all MCP agents in the project",
    "input": {
      "__self": {
        "type": "import(\"/Users/flyman/Desktop/projects/vs-mcp/src/tools/agent/list-agents.mcpx\").InputContext",
        "required": true
      }
    },
    "output": {
      "agents": {
        "type": "{ id: string; name: string; description?: string | undefined; path?: string | undefined; }[]",
        "required": true
      }
    }
  },
  {
    "id": "runAgent",
    "name": "Generate new agent",
    "path": "src/tools/agent/run-agent.mcpx.ts",
    "namespace": "agent",
    "description": "Generate a new MCP agent",
    "input": {
      "filepath": {
        "type": "string",
        "required": false
      }
    },
    "output": {
      "filepath": {
        "type": "string",
        "required": false
      },
      "response": {
        "type": "unknown",
        "required": true
      }
    }
  },
  {
    "id": "generateCode",
    "name": "Generate Code",
    "path": "src/tools/ai/generate-code.mcpx.ts",
    "namespace": "ai",
    "description": "Generate new code from a natural language prompt, specifying language and style.",
    "input": {
      "prompt": {
        "type": "string",
        "required": true
      },
      "language": {
        "type": "string",
        "required": false
      },
      "style": {
        "type": "string",
        "required": false
      },
      "maxTokens": {
        "type": "number",
        "required": false
      }
    },
    "output": {
      "prompt": {
        "type": "string",
        "required": true
      },
      "language": {
        "type": "string",
        "required": true
      },
      "style": {
        "type": "string",
        "required": false
      },
      "maxTokens": {
        "type": "number",
        "required": false
      },
      "code": {
        "type": "string",
        "required": true
      }
    }
  },
  {
    "id": "generateData",
    "name": "Generate Structured Data",
    "path": "src/tools/ai/generate-data.mcpx.ts",
    "namespace": "ai",
    "description": "Generate structured data (e.g., JSON) from a prompt and optional schema.",
    "input": {
      "prompt": {
        "type": "string",
        "required": true
      },
      "schema": {
        "type": "string",
        "required": false
      },
      "maxTokens": {
        "type": "number",
        "required": false
      },
      "model": {
        "type": "string",
        "required": false
      },
      "temperature": {
        "type": "number",
        "required": false
      }
    },
    "output": {
      "prompt": {
        "type": "string",
        "required": true
      },
      "schema": {
        "type": "string",
        "required": false
      },
      "maxTokens": {
        "type": "number",
        "required": false
      },
      "model": {
        "type": "string",
        "required": false
      },
      "temperature": {
        "type": "number",
        "required": false
      },
      "data": {
        "type": "any",
        "required": true
      }
    }
  },
  {
    "id": "generateImages",
    "name": "Generate Images",
    "path": "src/tools/ai/generate-images.mcpx.ts",
    "namespace": "ai",
    "description": "Generate images from a prompt using an AI model and optional parameters.",
    "input": {
      "prompt": {
        "type": "string",
        "required": true
      },
      "count": {
        "type": "number",
        "required": false
      },
      "size": {
        "type": "\"512x512\"",
        "required": false
      },
      "model": {
        "type": "string",
        "required": false
      }
    },
    "output": {
      "prompt": {
        "type": "string",
        "required": true
      },
      "count": {
        "type": "number",
        "required": false
      },
      "size": {
        "type": "\"512x512\"",
        "required": false
      },
      "model": {
        "type": "string",
        "required": false
      },
      "images": {
        "type": "any[]",
        "required": true
      },
      "note": {
        "type": "string",
        "required": false
      }
    }
  },
  {
    "id": "generateText",
    "name": "Generate Text",
    "path": "src/tools/ai/generate-text.mcpx.ts",
    "namespace": "ai",
    "description": "Generate plain text from a prompt.",
    "input": {
      "prompt": {
        "type": "string",
        "required": true
      },
      "maxTokens": {
        "type": "number",
        "required": false
      },
      "model": {
        "type": "string",
        "required": false
      },
      "temperature": {
        "type": "number",
        "required": false
      }
    },
    "output": {
      "prompt": {
        "type": "string",
        "required": true
      },
      "maxTokens": {
        "type": "number",
        "required": false
      },
      "model": {
        "type": "string",
        "required": false
      },
      "temperature": {
        "type": "number",
        "required": false
      },
      "text": {
        "type": "string",
        "required": true
      }
    }
  },
  {
    "id": "refactorCode",
    "name": "Refactor Code",
    "path": "src/tools/ai/refactor-code.mcpx.ts",
    "namespace": "ai",
    "description": "Refactor existing code based on instructions, language, and style.",
    "input": {
      "code": {
        "type": "string",
        "required": true
      },
      "instructions": {
        "type": "string",
        "required": true
      },
      "language": {
        "type": "string",
        "required": false
      },
      "style": {
        "type": "string",
        "required": false
      }
    },
    "output": {
      "code": {
        "type": "string",
        "required": true
      },
      "instructions": {
        "type": "string",
        "required": true
      },
      "language": {
        "type": "string",
        "required": false
      },
      "style": {
        "type": "string",
        "required": false
      },
      "refactoredCode": {
        "type": "string",
        "required": true
      }
    }
  },
  {
    "id": "testCode",
    "name": "Generate Tests",
    "path": "src/tools/ai/test-code.mcpx.ts",
    "namespace": "ai",
    "description": "Generate unit tests for code using the specified framework and language.",
    "input": {
      "code": {
        "type": "string",
        "required": true
      },
      "framework": {
        "type": "string",
        "required": false
      },
      "language": {
        "type": "string",
        "required": false
      }
    },
    "output": {
      "code": {
        "type": "string",
        "required": true
      },
      "framework": {
        "type": "string",
        "required": false
      },
      "language": {
        "type": "string",
        "required": false
      },
      "tests": {
        "type": "string",
        "required": true
      }
    }
  },
  {
    "id": "writeDocumentation",
    "name": "Write Documentation",
    "path": "src/tools/ai/write-documentation.mcpx.ts",
    "namespace": "ai",
    "description": "Write or update documentation for code in the specified format and audience.",
    "input": {
      "code": {
        "type": "string",
        "required": true
      },
      "format": {
        "type": "string",
        "required": false
      },
      "audience": {
        "type": "string",
        "required": false
      }
    },
    "output": {
      "code": {
        "type": "string",
        "required": true
      },
      "format": {
        "type": "string",
        "required": false
      },
      "audience": {
        "type": "string",
        "required": false
      },
      "docs": {
        "type": "string",
        "required": true
      }
    }
  },
  {
    "id": "activeFile",
    "name": "Active File",
    "path": "src/tools/editor/active-file.mcpx.ts",
    "namespace": "editor",
    "description": "Get the active editor file's path, languageId, and selected or full text.",
    "input": {},
    "output": {
      "__self": {
        "type": "null",
        "required": true
      }
    }
  },
  {
    "id": "openFile",
    "name": "Open File By Path",
    "path": "src/tools/editor/open-file.mcpx.ts",
    "namespace": "editor",
    "description": "Open a file in the editor by absolute path.",
    "input": {
      "path": {
        "type": "string",
        "required": true
      }
    },
    "output": {
      "ok": {
        "type": "false",
        "required": true
      }
    }
  },
  {
    "id": "openVirtual",
    "name": "Open Virtual Document",
    "path": "src/tools/editor/open-virtual.mcpx.ts",
    "namespace": "editor",
    "description": "Open a read-only virtual document with content and language.",
    "input": {
      "content": {
        "type": "string",
        "required": true
      },
      "language": {
        "type": "string",
        "required": false
      }
    },
    "output": {
      "content": {
        "type": "string",
        "required": true
      },
      "language": {
        "type": "string",
        "required": false
      },
      "ok": {
        "type": "false",
        "required": true
      }
    }
  },
  {
    "id": "proposeEdits",
    "name": "Propose Edits",
    "path": "src/tools/editor/propose-edits.mcpx.ts",
    "namespace": "editor",
    "description": "Show a diff and ask the user to apply changes to a file in the workspace.",
    "input": {
      "targetPath": {
        "type": "string",
        "required": true
      },
      "newContent": {
        "type": "string",
        "required": true
      },
      "title": {
        "type": "string",
        "required": false
      },
      "workspaceRoot": {
        "type": "string",
        "required": true
      }
    },
    "output": {
      "targetPath": {
        "type": "string",
        "required": true
      },
      "newContent": {
        "type": "string",
        "required": true
      },
      "title": {
        "type": "string",
        "required": false
      },
      "workspaceRoot": {
        "type": "string",
        "required": true
      },
      "applied": {
        "type": "false",
        "required": true
      }
    }
  },
  {
    "id": "editorSelection",
    "name": "Editor Selection",
    "path": "src/tools/editor/selection.mcpx.ts",
    "namespace": "editor",
    "description": "Get selection offsets and text for the active editor.",
    "input": {},
    "output": {
      "__self": {
        "type": "null",
        "required": true
      }
    }
  },
  {
    "id": "findFiles",
    "name": "Find Files",
    "path": "src/tools/fs/find.mcpx.ts",
    "namespace": "fs",
    "description": "Find files by glob pattern (workspace relative).",
    "input": {
      "glob": {
        "type": "string",
        "required": false
      },
      "maxResults": {
        "type": "number",
        "required": false
      }
    },
    "output": {
      "files": {
        "type": "string[]",
        "required": true
      }
    }
  },
  {
    "id": "readDir",
    "name": "Read Directory",
    "path": "src/tools/fs/read-dir.mcpx.ts",
    "namespace": "fs",
    "description": "List directory entries (name + kind).",
    "input": {
      "dir": {
        "type": "string",
        "required": true
      },
      "workspaceRoot": {
        "type": "string",
        "required": true
      }
    },
    "output": {
      "dir": {
        "type": "string",
        "required": true
      },
      "workspaceRoot": {
        "type": "string",
        "required": true
      },
      "items": {
        "type": "{ name: string; type: string; }[]",
        "required": true
      }
    }
  },
  {
    "id": "readFile",
    "name": "Read File",
    "path": "src/tools/fs/read-file.mcpx.ts",
    "namespace": "fs",
    "description": "Read a UTF-8 file inside the workspace.",
    "input": {
      "path": {
        "type": "string",
        "required": true
      },
      "workspaceRoot": {
        "type": "string",
        "required": true
      }
    },
    "output": {
      "path": {
        "type": "string",
        "required": true
      },
      "workspaceRoot": {
        "type": "string",
        "required": true
      },
      "text": {
        "type": "string",
        "required": true
      }
    }
  },
  {
    "id": "writeFile",
    "name": "Write File",
    "path": "src/tools/fs/write-file.mcpx.ts",
    "namespace": "fs",
    "description": "Write a UTF-8 file inside the workspace (with confirm).",
    "input": {
      "path": {
        "type": "string",
        "required": true
      },
      "content": {
        "type": "string",
        "required": true
      },
      "workspaceRoot": {
        "type": "string",
        "required": true
      }
    },
    "output": {
      "path": {
        "type": "string",
        "required": true
      },
      "content": {
        "type": "string",
        "required": true
      },
      "workspaceRoot": {
        "type": "string",
        "required": true
      },
      "ok": {
        "type": "false",
        "required": true
      }
    }
  },
  {
    "id": "createGitBranch",
    "name": "Create Git Branch",
    "path": "src/tools/git/create-branch.mcpx.ts",
    "namespace": "git",
    "description": "Create a new branch in the current repository using VS Code's Git extension.",
    "input": {
      "branchName": {
        "type": "string",
        "required": true
      }
    },
    "output": {
      "success": {
        "type": "false",
        "required": true
      },
      "error": {
        "type": "string",
        "required": false
      }
    }
  },
  {
    "id": "deleteGitBranch",
    "name": "Delete Git Branch",
    "path": "src/tools/git/delete-branch.mcpx.ts",
    "namespace": "git",
    "description": "Delete the specified branch in the current repository using VS Code's Git extension.",
    "input": {
      "branchName": {
        "type": "string",
        "required": true
      }
    },
    "output": {
      "success": {
        "type": "false",
        "required": true
      },
      "error": {
        "type": "string",
        "required": false
      }
    }
  },
  {
    "id": "mergeGitBranch",
    "name": "Merge Git Branch",
    "path": "src/tools/git/merge-branch.mcpx.ts",
    "namespace": "git",
    "description": "Merge the specified branch into the current branch using VS Code's Git extension.",
    "input": {
      "branchName": {
        "type": "string",
        "required": true
      }
    },
    "output": {
      "success": {
        "type": "false",
        "required": true
      },
      "error": {
        "type": "string",
        "required": false
      }
    }
  },
  {
    "id": "createGitHubIssue",
    "name": "Create GitHub Issue",
    "path": "src/tools/github/create-issue.mcpx.ts",
    "namespace": "github",
    "description": "Create a new issue in a GitHub repository using VS Code's GitHub integration.",
    "input": {
      "repository": {
        "type": "string",
        "required": true
      },
      "title": {
        "type": "string",
        "required": true
      },
      "body": {
        "type": "string",
        "required": false
      }
    },
    "output": {
      "issueUrl": {
        "type": "null",
        "required": true
      }
    }
  },
  {
    "id": "createGitHubPullRequest",
    "name": "Create GitHub Pull Request",
    "path": "src/tools/github/create-pr.mcpx.ts",
    "namespace": "github",
    "description": "Create a new pull request in a GitHub repository using VS Code's GitHub integration.",
    "input": {
      "repository": {
        "type": "string",
        "required": true
      },
      "title": {
        "type": "string",
        "required": true
      },
      "body": {
        "type": "string",
        "required": false
      },
      "base": {
        "type": "string",
        "required": false
      },
      "head": {
        "type": "string",
        "required": false
      }
    },
    "output": {
      "prUrl": {
        "type": "null",
        "required": true
      }
    }
  },
  {
    "id": "openGitHubRepository",
    "name": "Open GitHub Repository",
    "path": "src/tools/github/open-repo.mcpx.ts",
    "namespace": "github",
    "description": "Open a GitHub repository in the browser using VS Code's GitHub integration.",
    "input": {
      "repository": {
        "type": "string",
        "required": true
      }
    },
    "output": {
      "repoUrl": {
        "type": "string",
        "required": true
      }
    }
  },
  {
    "id": "showStatusBar",
    "name": "Show Status Bar",
    "path": "src/tools/status/bar.mcpx.ts",
    "namespace": "status",
    "description": "Show a status message in the status bar. Optionally show a spinner.",
    "input": {
      "id": {
        "type": "string",
        "required": true
      },
      "message": {
        "type": "string",
        "required": true
      },
      "spinner": {
        "type": "false",
        "required": false
      }
    },
    "output": {
      "id": {
        "type": "string",
        "required": true
      },
      "message": {
        "type": "string",
        "required": true
      },
      "spinner": {
        "type": "false",
        "required": true
      },
      "shown": {
        "type": "false",
        "required": true
      }
    }
  },
  {
    "id": "dismissStatus",
    "name": "Dismiss Status",
    "path": "src/tools/status/dismiss.mcpx.ts",
    "namespace": "status",
    "description": "Dismiss any status notification by id.",
    "input": {
      "id": {
        "type": "string",
        "required": true
      }
    },
    "output": {
      "id": {
        "type": "string",
        "required": true
      },
      "dismissed": {
        "type": "false",
        "required": true
      }
    }
  },
  {
    "id": "showStatusWindow",
    "name": "Show Status Window",
    "path": "src/tools/status/window.mcpx.ts",
    "namespace": "status",
    "description": "Show a status message in a window notification.",
    "input": {
      "id": {
        "type": "string",
        "required": true
      },
      "message": {
        "type": "string",
        "required": true
      }
    },
    "output": {
      "id": {
        "type": "string",
        "required": true
      },
      "message": {
        "type": "string",
        "required": true
      },
      "shown": {
        "type": "false",
        "required": true
      }
    }
  },
  {
    "id": "closeTerminal",
    "name": "Close Terminal",
    "path": "src/tools/terminal/close.mcpx.ts",
    "namespace": "terminal",
    "description": "Close a specific integrated terminal in VS Code.",
    "input": {
      "terminalId": {
        "type": "string",
        "required": true
      }
    },
    "output": {
      "success": {
        "type": "false",
        "required": true
      }
    }
  },
  {
    "id": "createTerminal",
    "name": "Create Terminal",
    "path": "src/tools/terminal/create.mcpx.ts",
    "namespace": "terminal",
    "description": "Create a new integrated terminal in VS Code.",
    "input": {
      "name": {
        "type": "string",
        "required": false
      }
    },
    "output": {
      "terminalId": {
        "type": "string",
        "required": true
      }
    }
  },
  {
    "id": "listTerminals",
    "name": "List Terminals",
    "path": "src/tools/terminal/list.mcpx.ts",
    "namespace": "terminal",
    "description": "List all open integrated terminals in VS Code.",
    "input": {},
    "output": {
      "terminals": {
        "type": "string[]",
        "required": true
      }
    }
  },
  {
    "id": "sendTextToTerminal",
    "name": "Send Text to Terminal",
    "path": "src/tools/terminal/send.mcpx.ts",
    "namespace": "terminal",
    "description": "Send text or command to a specific integrated terminal.",
    "input": {
      "terminalId": {
        "type": "string",
        "required": true
      },
      "text": {
        "type": "string",
        "required": true
      }
    },
    "output": {
      "success": {
        "type": "false",
        "required": true
      }
    }
  },
  {
    "id": "showTerminal",
    "name": "Show Terminal",
    "path": "src/tools/terminal/show.mcpx.ts",
    "namespace": "terminal",
    "description": "Show a specific integrated terminal in VS Code.",
    "input": {
      "terminalId": {
        "type": "string",
        "required": true
      }
    },
    "output": {
      "success": {
        "type": "false",
        "required": true
      }
    }
  },
  {
    "id": "showInfoMessage",
    "name": "Show Info Message",
    "path": "src/tools/ui/info.mcpx.ts",
    "namespace": "ui",
    "description": "Show info message with optional actions.",
    "input": {
      "message": {
        "type": "string",
        "required": true
      },
      "actions": {
        "type": "string[]",
        "required": false
      }
    },
    "output": {
      "choice": {
        "type": "null",
        "required": true
      }
    }
  },
  {
    "id": "showInputBox",
    "name": "Show Input Box",
    "path": "src/tools/ui/input.mcpx.ts",
    "namespace": "ui",
    "description": "Prompt user for a string input.",
    "input": {
      "prompt": {
        "type": "string",
        "required": true
      },
      "placeHolder": {
        "type": "string",
        "required": false
      }
    },
    "output": {
      "value": {
        "type": "null",
        "required": true
      }
    }
  },
  {
    "id": "showWarningMessage",
    "name": "Show Warning Message",
    "path": "src/tools/ui/warn.mcpx.ts",
    "namespace": "ui",
    "description": "Show warning message with optional actions.",
    "input": {
      "message": {
        "type": "string",
        "required": true
      },
      "actions": {
        "type": "string[]",
        "required": false
      }
    },
    "output": {
      "choice": {
        "type": "null",
        "required": true
      }
    }
  },
  {
    "id": "commitChanges",
    "name": "Commit Changes",
    "path": "src/tools/vcs/commit.mcpx.ts",
    "namespace": "vcs",
    "description": "Commit staged changes in the current repository with a message (supports any VCS provider).",
    "input": {
      "message": {
        "type": "string",
        "required": true
      }
    },
    "output": {
      "success": {
        "type": "false",
        "required": true
      },
      "error": {
        "type": "string",
        "required": false
      }
    }
  },
  {
    "id": "pullChanges",
    "name": "Pull Changes",
    "path": "src/tools/vcs/pull.mcpx.ts",
    "namespace": "vcs",
    "description": "Pull changes from the remote repository (supports any VCS provider).",
    "input": {},
    "output": {
      "success": {
        "type": "false",
        "required": true
      },
      "error": {
        "type": "string",
        "required": false
      }
    }
  },
  {
    "id": "pushChanges",
    "name": "Push Changes",
    "path": "src/tools/vcs/push.mcpx.ts",
    "namespace": "vcs",
    "description": "Push committed changes to the remote repository (supports any VCS provider).",
    "input": {},
    "output": {
      "success": {
        "type": "false",
        "required": true
      },
      "error": {
        "type": "string",
        "required": false
      }
    }
  },
  {
    "id": "getVcsStatus",
    "name": "VCS Status",
    "path": "src/tools/vcs/status.mcpx.ts",
    "namespace": "vcs",
    "description": "Get the status of the current repository (supports any VCS provider).",
    "input": {},
    "output": {
      "status": {
        "type": "string",
        "required": true
      },
      "error": {
        "type": "string",
        "required": false
      }
    }
  },
  {
    "id": "connectIntegration",
    "name": "Connect Integration",
    "path": "src/tools/integration/connect.mcpx.ts",
    "namespace": "integration",
    "description": "Connect to a specified MCP integration",
    "input": {
      "integrationId": {
        "type": "string",
        "required": true
      },
      "options": {
        "type": "any",
        "required": true
      },
      "showUI": {
        "type": "false",
        "required": false
      }
    },
    "output": {
      "result": {
        "type": "any",
        "required": true
      }
    }
  },
  {
    "id": "listIntegrations",
    "name": "List Integrations",
    "path": "src/tools/integration/list.mcpx.ts",
    "namespace": "integration",
    "description": "List all available MCP integrations",
    "input": {
      "showUI": {
        "type": "false",
        "required": false
      }
    },
    "output": {
      "integrations": {
        "type": "any[]",
        "required": true
      }
    }
  },
  {
    "id": "createWorkspaceFile",
    "name": "Create Workspace File",
    "path": "src/tools/workspace/create-file.mcpx.ts",
    "namespace": "workspace",
    "description": "Create a new file in the workspace with optional content.",
    "input": {
      "path": {
        "type": "string",
        "required": true
      },
      "content": {
        "type": "string",
        "required": false
      }
    },
    "output": {
      "success": {
        "type": "false",
        "required": true
      },
      "error": {
        "type": "string",
        "required": false
      }
    }
  },
  {
    "id": "deleteWorkspaceFile",
    "name": "Delete Workspace File",
    "path": "src/tools/workspace/delete-file.mcpx.ts",
    "namespace": "workspace",
    "description": "Delete a file from the workspace.",
    "input": {
      "path": {
        "type": "string",
        "required": true
      }
    },
    "output": {
      "success": {
        "type": "false",
        "required": true
      },
      "error": {
        "type": "string",
        "required": false
      }
    }
  },
  {
    "id": "listWorkspaceFiles",
    "name": "List Workspace Files",
    "path": "src/tools/workspace/list-files.mcpx.ts",
    "namespace": "workspace",
    "description": "List files in the workspace matching a glob pattern.",
    "input": {
      "glob": {
        "type": "string",
        "required": false
      }
    },
    "output": {
      "files": {
        "type": "string[]",
        "required": true
      }
    }
  },
  {
    "id": "listWorkspaceFolders",
    "name": "List Workspace Folders",
    "path": "src/tools/workspace/list-folders.mcpx.ts",
    "namespace": "workspace",
    "description": "List all workspace folders.",
    "input": {},
    "output": {
      "folders": {
        "type": "string[]",
        "required": true
      }
    }
  },
  {
    "id": "renameWorkspaceFolder",
    "name": "Rename Workspace Folder",
    "path": "src/tools/workspace/rename-folder.mcpx.ts",
    "namespace": "workspace",
    "description": "Rename a folder in the workspace using VS Code's file system API (preserves user security permissions).",
    "input": {
      "oldPath": {
        "type": "string",
        "required": true
      },
      "newPath": {
        "type": "string",
        "required": true
      }
    },
    "output": {
      "success": {
        "type": "false",
        "required": true
      },
      "error": {
        "type": "string",
        "required": false
      }
    }
  }
]
```

## Required Error Pattern
- Derive a safe string from unknown errors.
- Inform the user via `ui.showWarningMessage`.
- Always dismiss any active status item.

```js
// Error pattern to copy:
const msg = err && typeof err === "object" && "message" in err ? err.message : String(err);
await mcp.dispatch('ui.showWarningMessage', { message: 'An error occurred: ' + msg });
```

## Minimal Agent Template (copy exactly when starting a new agent)

```javascript
// path/to/<your-agent>.agent.js

export const metadata = {
  id: 'writeTechBlogPost',
  name: 'Write Tech Blog Post',
  description: 'Generates a tech blog post based on a given topic and structure.'
};

export const run = async ({ mcp, scope }) => {
  await mcp.dispatch('status.showStatusBar', {
    id: 'writeTechBlogPost',
    message: 'Generating tech blog post…',
    spinner: true
  });

  try {
    const { value: topic } = await mcp.dispatch('ui.showInputBox', {
      prompt: 'What topic do you want to write about?'
    });

    if (!topic) {
      await mcp.dispatch('status.dismissStatus', { id: 'writeTechBlogPost' });
      await mcp.dispatch('ui.showInformationMessage', { message: 'Canceled by user.' });
      return;
    }

    const aiResult = await mcp.dispatch('ai.generateText', {
      prompt: `Write a concise, structured tech blog post about "${topic}". Include an intro, 2–3 sections with bullets, and a conclusion. Use semantic Markdown.`,
      maxTokens: 800
    });

    await mcp.dispatch('editor.openVirtual', {
      content: aiResult.text,
      language: 'md',
      title: `blog-${topic.replace(/\s+/g, '-').toLowerCase()}.md`
    });

    await mcp.dispatch('status.dismissStatus', { id: 'writeTechBlogPost' });
  } catch (err) {
    const msg = err && typeof err === "object" && "message" in err ? err.message : String(err);
    await mcp.dispatch('status.dismissStatus', { id: 'writeTechBlogPost' });
    await mcp.dispatch('ui.showWarningMessage', { message: 'An error occurred: ' + msg });
  }
};
```

## Do / Don’t

**Do**
- Use only `mcp.dispatch` for UI, status, AI, editor, FS, telemetry.
- Keep a single `try/catch`.
- Validate inputs; handle cancel paths.
- Use semantic Markdown for docs.

**Don’t**
- Don’t import Node/VS Code APIs or OpenAI SDKs.
- Don’t wrap `mcp.dispatch`.
- Don’t log to console or use timers.
- Don’t mutate global state or use env vars.

## Example: End-to-End Writing Agent (reference)
```javascript
// path/to/write-tech-blog-post.agent.js

export const metadata = {
  id: 'writeTechBlogPost',
  name: 'Write Tech Blog Post',
  description: 'Generates a tech blog post based on a given topic and structure.'
};

export const run = async ({ mcp, scope }) => {
  await mcp.dispatch('status.showStatusBar', {
    id: 'generateBlogPost',
    message: 'Generating tech blog post…',
    spinner: true
  });

  try {
    const { value: topic } = await mcp.dispatch('ui.showInputBox', {
      prompt: 'What topic do you want to write about?'
    });

    if (!topic) {
      await mcp.dispatch('status.dismissStatus', { id: 'generateBlogPost' });
      await mcp.dispatch('ui.showInformationMessage', { message: 'Canceled by user.' });
      return;
    }

    const blogPost = await mcp.dispatch('ai.generateText', {
      prompt: `Write a tech blog post about "${topic}". Include an introduction, 2–3 concise sections, and a conclusion. Use headings and bullets.`,
      maxTokens: 800
    });

    await mcp.dispatch('editor.openVirtual', {
      content: blogPost.text,
      language: 'md',
      title: `blog-${topic.replace(/\s+/g, '-').toLowerCase()}.md`
    });

    await mcp.dispatch('status.dismissStatus', { id: 'generateBlogPost' });
  } catch (err) {
    const msg = err && typeof err === "object" && "message" in err ? err.message : String(err);
    await mcp.dispatch('status.dismissStatus', { id: 'generateBlogPost' });
    await mcp.dispatch('ui.showWarningMessage', { message: 'An error occurred: ' + msg });
  }
};
```

## Self-Checklist (must be true before finishing)
- [ ] Decision Gate passed (filename/keywords + intent).
- [ ] ESM named exports only: `metadata`, `run`.
- [ ] Only `mcp.dispatch` for all interactions.
- [ ] Single `try/catch`; required error pattern used.
- [ ] Status shown/dismissed around long tasks.
- [ ] No console/timers/Node/VS Code/OpenAI SDK imports.
- [ ] Inputs validated; cancel path handled.
- [ ] Output via MCP editor tools.

---
**If this is not a VS-MCP agent request or file, output only:**  
`// Ignored: Not a VS-MCP agent per project rules.`
