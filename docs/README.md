# MCPX Tool Documentation

This index lists all available MCPX tool namespaces and their tools.

## [agent](./agent)

| MCP | Description |
| --- | ----------- |
| `agent.createAgent` | Generate a new MCP agent |
| `agent.listAgents` | List all MCP agents in the project |
| `agent.runAgent` | Generate a new MCP agent |

## [ai](./ai)

| MCP | Description |
| --- | ----------- |
| `ai.generateCode` | Generate new code from a natural language prompt, specifying language and style. |
| `ai.generateData` | Generate structured data (e.g., JSON) from a prompt and optional schema. |
| `ai.generateImages` | Generate images from a prompt using an AI model and optional parameters. |
| `ai.generateText` | Generate plain text from a prompt. |
| `ai.refactorCode` | Refactor existing code based on instructions, language, and style. |
| `ai.testCode` | Generate unit tests for code using the specified framework and language. |
| `ai.writeDocumentation` | Write or update documentation for code in the specified format and audience. |

## [fs](./fs)

| MCP | Description |
| --- | ----------- |
| `fs.findFiles` | Find files by glob pattern (workspace relative). |
| `fs.readDir` | List directory entries (name + kind). |
| `fs.readFile` | Read a UTF-8 file inside the workspace. |
| `fs.writeFile` | Write a UTF-8 file inside the workspace (with confirm). |

## [status](./status)

| MCP | Description |
| --- | ----------- |
| `status.showStatusBar` | Show a status message in the status bar. Optionally show a spinner. |
| `status.dismissStatus` | Dismiss any status notification by id. |
| `status.showStatusWindow` | Show a status message in a window notification. |

## [terminal](./terminal)

| MCP | Description |
| --- | ----------- |
| `terminal.closeTerminal` | Close a specific integrated terminal in VS Code. |
| `terminal.createTerminal` | Create a new integrated terminal in VS Code. |
| `terminal.listTerminals` | List all open integrated terminals in VS Code. |
| `terminal.sendTextToTerminal` | Send text or command to a specific integrated terminal. |
| `terminal.showTerminal` | Show a specific integrated terminal in VS Code. |

## [ui](./ui)

| MCP | Description |
| --- | ----------- |
| `ui.showInfoMessage` | Show info message with optional actions. |
| `ui.showInputBox` | Prompt user for a string input. |
| `ui.showWarningMessage` | Show warning message with optional actions. |

## [vcs](./vcs)

| MCP | Description |
| --- | ----------- |
| `vcs.commitChanges` | Commit staged changes in the current repository with a message (supports any VCS provider). |
| `vcs.pullChanges` | Pull changes from the remote repository (supports any VCS provider). |
| `vcs.pushChanges` | Push committed changes to the remote repository (supports any VCS provider). |
| `vcs.getVcsStatus` | Get the status of the current repository (supports any VCS provider). |

## [workspace](./workspace)

| MCP | Description |
| --- | ----------- |
| `workspace.createWorkspaceFile` | Create a new file in the workspace with optional content. |
| `workspace.deleteWorkspaceFile` | Delete a file from the workspace. |
| `workspace.listWorkspaceFiles` | List files in the workspace matching a glob pattern. |
| `workspace.listWorkspaceFolders` | List all workspace folders. |
| `workspace.renameWorkspaceFolder` | Rename a folder in the workspace using VS Code's file system API (preserves user security permissions). |

## [git](./git)

| MCP | Description |
| --- | ----------- |
| `git.createGitBranch` | Create a new branch in the current repository using VS Code's Git extension. |
| `git.deleteGitBranch` | Delete the specified branch in the current repository using VS Code's Git extension. |
| `git.mergeGitBranch` | Merge the specified branch into the current branch using VS Code's Git extension. |

## [editor](./editor)

| MCP | Description |
| --- | ----------- |
| `editor.activeFile` | Get the active editor file's path, languageId, and selected or full text. |
| `editor.openFile` | Open a file in the editor by absolute path. |
| `editor.openVirtual` | Open a read-only virtual document with content and language. |
| `editor.proposeEdits` | Show a diff and ask the user to apply changes to a file in the workspace. |
| `editor.editorSelection` | Get selection offsets and text for the active editor. |

## [github](./github)

| MCP | Description |
| --- | ----------- |
| `github.createGitHubIssue` | Create a new issue in a GitHub repository using VS Code's GitHub integration. |
| `github.createGitHubPullRequest` | Create a new pull request in a GitHub repository using VS Code's GitHub integration. |
| `github.openGitHubRepository` | Open a GitHub repository in the browser using VS Code's GitHub integration. |

