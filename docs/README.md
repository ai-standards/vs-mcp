# VS‑MCP: Runtime extensions for VS Code

VS‑MCP lets you ship an extension as a single JavaScript function. No scaffolding, no packaging. Write a function, run it, and it behaves like a real extension at runtime. That makes it ideal for testing commands, exploring editor APIs, or wiring small tools directly into your workflow.

Under the hood, VS‑MCP hosts a lightweight MCP server and injects it into your functions. You get direct access to VS Code’s APIs without boilerplate; the server handles integration. Iteration stays tight: change code, reload, and you’re live. Whether you’re prototyping a command, adding AI to your editor, or sharing a tool with your team, VS‑MCP is the shortest path from idea to working extension.


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

## [agent](/docs/agent)

The agent namespace manages MCP agents you can generate, list, and run from inside VS Code. Use it to scaffold an agent, inspect what’s available in your project, and execute one against a given input or file path. It’s a simple way to prototype agent-driven flows without wiring a full extension.

| MCP | Description |
| --- | ----------- |
| `agent.createAgent` | Generate a new MCP agent |
| `agent.listAgents` | List all MCP agents in the project |
| `agent.runAgent` | Generate a new MCP agent |

## [ai](/docs/ai)

The ai namespace wires AI into your editor tasks: generate code or text, produce structured data, refactor existing code, write docs, or even synthesize images. Each tool focuses on a concrete outcome, so you can compose them into command flows that fit your project.

| MCP | Description |
| --- | ----------- |
| `ai.generateCode` | Generate new code from a natural language prompt, specifying language and style. |
| `ai.generateData` | Generate structured data (e.g., JSON) from a prompt and optional schema. |
| `ai.generateImages` | Generate images from a prompt using an AI model and optional parameters. |
| `ai.generateText` | Generate plain text from a prompt. |
| `ai.refactorCode` | Refactor existing code based on instructions, language, and style. |
| `ai.testCode` | Generate unit tests for code using the specified framework and language. |
| `ai.writeDocumentation` | Write or update documentation for code in the specified format and audience. |

## [fs](/docs/fs)

The fs namespace gives you safe, workspace‑scoped file operations: find, read, write, and list directories. All interactions go through VS Code’s file system interfaces, so they respect workspace boundaries and user permissions.

| MCP | Description |
| --- | ----------- |
| `fs.findFiles` | Find files by glob pattern (workspace relative). |
| `fs.readDir` | List directory entries (name + kind). |
| `fs.readFile` | Read a UTF-8 file inside the workspace. |
| `fs.writeFile` | Write a UTF-8 file inside the workspace (with confirm). |

## [status](/docs/status)

Use the status namespace to surface feedback in the editor: show a transient status bar message, a spinner during long tasks, or a window notification. You can also dismiss messages programmatically when the work completes.

| MCP | Description |
| --- | ----------- |
| `status.showStatusBar` | Show a status message in the status bar. Optionally show a spinner. |
| `status.dismissStatus` | Dismiss any status notification by id. |
| `status.showStatusWindow` | Show a status message in a window notification. |

## [terminal](/docs/terminal)

The terminal namespace manages integrated terminals. Create or show a terminal, list what’s open, send commands, and close when done. It’s useful for automating build, test, or dev server workflows without leaving the editor.

| MCP | Description |
| --- | ----------- |
| `terminal.closeTerminal` | Close a specific integrated terminal in VS Code. |
| `terminal.createTerminal` | Create a new integrated terminal in VS Code. |
| `terminal.listTerminals` | List all open integrated terminals in VS Code. |
| `terminal.sendTextToTerminal` | Send text or command to a specific integrated terminal. |
| `terminal.showTerminal` | Show a specific integrated terminal in VS Code. |

## [ui](/docs/ui)

The ui namespace provides simple prompts and messages. Ask for input, show info or warnings, and capture user choices to drive the next step in your command.

| MCP | Description |
| --- | ----------- |
| `ui.showInfoMessage` | Show info message with optional actions. |
| `ui.showInputBox` | Prompt user for a string input. |
| `ui.showWarningMessage` | Show warning message with optional actions. |

## [vcs](/docs/vcs)

The vcs namespace abstracts basic version control actions—commit, pull, push, and status—so your commands can operate across providers supported by VS Code. It’s a thin layer for common flows like “generate → review → commit → push.”

| MCP | Description |
| --- | ----------- |
| `vcs.commitChanges` | Commit staged changes in the current repository with a message (supports any VCS provider). |
| `vcs.pullChanges` | Pull changes from the remote repository (supports any VCS provider). |
| `vcs.pushChanges` | Push committed changes to the remote repository (supports any VCS provider). |
| `vcs.getVcsStatus` | Get the status of the current repository (supports any VCS provider). |

## [editor](/docs/editor)

The editor namespace interacts with the active editor. Open files (real or virtual), inspect the current file and selection, and propose edits via a diff view users can accept. It’s designed to keep humans in the loop while automating the busywork.

| MCP | Description |
| --- | ----------- |
| `editor.activeFile` | Get the active editor file's path, languageId, and selected or full text. |
| `editor.openFile` | Open a file in the editor by absolute path. |
| `editor.openVirtual` | Open a read-only virtual document with content and language. |
| `editor.proposeEdits` | Show a diff and ask the user to apply changes to a file in the workspace. |
| `editor.editorSelection` | Get selection offsets and text for the active editor. |

## [workspace](/docs/workspace)

The workspace namespace works at the project level: create or delete files, list folders and files, and rename folders through VS Code’s APIs (respecting permissions and security prompts).

| MCP | Description |
| --- | ----------- |
| `workspace.createWorkspaceFile` | Create a new file in the workspace with optional content. |
| `workspace.deleteWorkspaceFile` | Delete a file from the workspace. |
| `workspace.listWorkspaceFiles` | List files in the workspace matching a glob pattern. |
| `workspace.listWorkspaceFolders` | List all workspace folders. |
| `workspace.renameWorkspaceFolder` | Rename a folder in the workspace using VS Code's file system API (preserves user security permissions). |

## [github](/docs/github)

The github namespace integrates with VS Code’s GitHub support. Create issues and pull requests, or open a repository in the browser—handy for stitching editor actions to GitHub workflows.

| MCP | Description |
| --- | ----------- |
| `github.createGitHubIssue` | Create a new issue in a GitHub repository using VS Code's GitHub integration. |
| `github.createGitHubPullRequest` | Create a new pull request in a GitHub repository using VS Code's GitHub integration. |
| `github.openGitHubRepository` | Open a GitHub repository in the browser using VS Code's GitHub integration. |

## [git](/docs/git)

The git namespace handles branch‑level operations through VS Code’s Git extension. Create, delete, and merge branches from your command flow.

| MCP | Description |
| --- | ----------- |
| `git.createGitBranch` | Create a new branch in the current repository using VS Code's Git extension. |
| `git.deleteGitBranch` | Delete the specified branch in the current repository using VS Code's Git extension. |
| `git.mergeGitBranch` | Merge the specified branch into the current branch using VS Code's Git extension. |