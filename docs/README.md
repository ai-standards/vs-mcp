# VS-MCP: Runtime Extensions for VS Code

VS-MCP grew out of a simple need: trying out ideas in VS Code without the overhead of a full extension build. With it, a single JavaScript function can run as an extension at runtime. That makes it straightforward to test commands, explore APIs, or wire up quick tools directly in the editor.

Under the hood, VS-MCP runs on a lightweight MCP server injected into your functions. You get direct access to editor APIs with almost no boilerplate — you focus on logic, the server handles integration. Iteration is fast: update your function, reload, and you’re live. Whether you’re prototyping a new command, wiring AI into your workflow, or building a tool for your team, VS-MCP offers the shortest path from idea to working extension.

## Example: a one-file runtime extension

```javascript
export const metadata = {
  id: 'create-blog-post-with-ai',
  name: 'Create Blog Post with AI',
  description: 'Generates a blog post that shares good news using AI.'
}

export const run = async ({ mcp, scope }) => {
  // Prompt the user for the topic of the blog post
  const { value } = await mcp.dispatch('ui.showInputBox', {
    prompt: 'What topic do you want to write about?'
  });

  // Notify the user that the blog post generation is starting
  await mcp.dispatch('status.bar', {
    message: 'Generating blog post',
    id: 'generate-blog-post',
    spinner: true
  });
  
  try {
    // Generate the blog post content using AI
    const response = await mcp.dispatch('ai.generateText', {
      prompt: `Write a blog post about ${value}.`,
      maxTokens: 500
    });

    // Dismiss the loading status
    await mcp.dispatch('status.dismiss', { id: 'generate-blog-post' });

    // Open the new post in the editor
    await mcp.dispatch('editor.openVirtual', { language: 'md', content: response.text });
  } catch (err) {
    // Handle any errors that occur during the generation process
    const msg = err && typeof err === "object" && "message" in err ? err.message : String(err);
    try {
      await mcp.dispatch('ui.showWarningMessage', { message: 'An error occurred while generating the blog post: ' + msg });
    } catch {
      // Swallow to avoid unhandled rejections in extension host
    }
  }
}
```

## agent

Folder: [/docs/agent](/docs/agent)

The agent namespace helps you create, list, and run custom MCP agents directly from your workspace. Use it to scaffold assistants that encapsulate workflows or project-aware behaviors.

Agents can be iterated quickly: generate one, run it, and refine the behavior without leaving the editor.

| MCP | Description |
| --- | ----------- |
| `agent.createAgent` | Generate a new MCP agent |
| `agent.listAgents` | List all MCP agents in the project |
| `agent.runAgent` | Generate a new MCP agent |

## ai

Folder: [/docs/ai](/docs/ai)

The ai namespace provides higher-level AI helpers for text, code, images, and structured data. These tools pair well with editor and workspace actions for end-to-end automation.

Use them to prototype AI-assisted features: code generation, refactors, tests, or content workflows.

| MCP | Description |
| --- | ----------- |
| `ai.generateCode` | Generate new code from a natural language prompt, specifying language and style. |
| `ai.generateData` | Generate structured data (e.g., JSON) from a prompt and optional schema. |
| `ai.generateImages` | Generate images from a prompt using an AI model and optional parameters. |
| `ai.generateText` | Generate plain text from a prompt. |
| `ai.refactorCode` | Refactor existing code based on instructions, language, and style. |
| `ai.testCode` | Generate unit tests for code using the specified framework and language. |
| `ai.writeDocumentation` | Write or update documentation for code in the specified format and audience. |

## fs

Folder: [/docs/fs](/docs/fs)

The fs namespace offers direct access to files and directories within the workspace. It’s ideal for building tools that scan, read, or write project files under user control.

Combine fs with editor and ai to implement smart transforms or project audits.

| MCP | Description |
| --- | ----------- |
| `fs.findFiles` | Find files by glob pattern (workspace relative). |
| `fs.readDir` | List directory entries (name + kind). |
| `fs.readFile` | Read a UTF-8 file inside the workspace. |
| `fs.writeFile` | Write a UTF-8 file inside the workspace (with confirm). |

## status

Folder: [/docs/status](/docs/status)

The status namespace shows progress and notifications in the editor. Use it to keep users informed during long-running or multi-step tasks.

Status messages can be bar or window style, and can be dismissed by id.

| MCP | Description |
| --- | ----------- |
| `status.showStatusBar` | Show a status message in the status bar. Optionally show a spinner. |
| `status.dismissStatus` | Dismiss any status notification by id. |
| `status.showStatusWindow` | Show a status message in a window notification. |

## terminal

Folder: [/docs/terminal](/docs/terminal)

The terminal namespace manages integrated terminals. It lets you create, show, send commands to, and close terminals programmatically.

Use it to script builds, run linters, or orchestrate dev tasks from your functions.

| MCP | Description |
| --- | ----------- |
| `terminal.closeTerminal` | Close a specific integrated terminal in VS Code. |
| `terminal.createTerminal` | Create a new integrated terminal in VS Code. |
| `terminal.listTerminals` | List all open integrated terminals in VS Code. |
| `terminal.sendTextToTerminal` | Send text or command to a specific integrated terminal. |
| `terminal.showTerminal` | Show a specific integrated terminal in VS Code. |

## ui

Folder: [/docs/ui](/docs/ui)

The ui namespace provides simple prompts and messages. It’s the fastest way to gather user input or present choices.

Keep flows simple: ask, act, confirm.

| MCP | Description |
| --- | ----------- |
| `ui.showInfoMessage` | Show info message with optional actions. |
| `ui.showInputBox` | Prompt user for a string input. |
| `ui.showWarningMessage` | Show warning message with optional actions. |

## vcs

Folder: [/docs/vcs](/docs/vcs)

The vcs namespace abstracts version control actions usable across providers supported by VS Code. It handles status checks and basic sync operations.

Automate commit/pull/push flows around generated changes.

| MCP | Description |
| --- | ----------- |
| `vcs.commitChanges` | Commit staged changes in the current repository with a message (supports any VCS provider). |
| `vcs.pullChanges` | Pull changes from the remote repository (supports any VCS provider). |
| `vcs.pushChanges` | Push committed changes to the remote repository (supports any VCS provider). |
| `vcs.getVcsStatus` | Get the status of the current repository (supports any VCS provider). |

## editor

Folder: [/docs/editor](/docs/editor)

The editor namespace interacts with the active editor and documents. It can open files, create virtual documents, inspect selections, and propose edits with a diff.

Use it to close the loop: generate content, show it, and optionally apply changes.

| MCP | Description |
| --- | ----------- |
| `editor.activeFile` | Get the active editor file's path, languageId, and selected or full text. |
| `editor.openFile` | Open a file in the editor by absolute path. |
| `editor.openVirtual` | Open a read-only virtual document with content and language. |
| `editor.proposeEdits` | Show a diff and ask the user to apply changes to a file in the workspace. |
| `editor.editorSelection` | Get selection offsets and text for the active editor. |

## workspace

Folder: [/docs/workspace](/docs/workspace)

The workspace namespace operates on files and folders at the project level. It’s useful for scaffolding, cleanup, and bulk operations across the repo.

Use it alongside ai and fs to build project-wide tools.

| MCP | Description |
| --- | ----------- |
| `workspace.createWorkspaceFile` | Create a new file in the workspace with optional content. |
| `workspace.deleteWorkspaceFile` | Delete a file from the workspace. |
| `workspace.listWorkspaceFiles` | List files in the workspace matching a glob pattern. |
| `workspace.listWorkspaceFolders` | List all workspace folders. |
| `workspace.renameWorkspaceFolder` | Rename a folder in the workspace using VS Code's file system API (preserves user security permissions). |

## github

Folder: [/docs/github](/docs/github)

The github namespace integrates with VS Code’s GitHub features. It can open repositories, and create issues or pull requests from inside the editor.

Great for turning local changes into shareable work without context switching.

| MCP | Description |
| --- | ----------- |
| `github.createGitHubIssue` | Create a new issue in a GitHub repository using VS Code's GitHub integration. |
| `github.createGitHubPullRequest` | Create a new pull request in a GitHub repository using VS Code's GitHub integration. |
| `github.openGitHubRepository` | Open a GitHub repository in the browser using VS Code's GitHub integration. |

## git

Folder: [/docs/git](/docs/git)

The git namespace exposes common Git actions through the VS Code Git extension. It’s focused on branch operations you’ll use in scripted flows.

Use it to create and manage branches around automated changes.

| MCP | Description |
| --- | ----------- |
| `git.createGitBranch` | Create a new branch in the current repository using VS Code's Git extension. |
| `git.deleteGitBranch` | Delete the specified branch in the current repository using VS Code's Git extension. |
| `git.mergeGitBranch` | Merge the specified branch into the current branch using VS Code's Git extension. |