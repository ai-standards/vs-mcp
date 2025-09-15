# MCPX Tool Documentation

This index lists all available MCPX tool namespaces and their tools.

## agent
[Full docs for agent](mcpx/agent.md)

- **Generate new agent** `agent.createAgent`: Generate a new MCP agent
- **List Agents** `agent.listAgents`: List all MCP agents in the project
- **Generate new agent** `agent.runAgent`: Generate a new MCP agent

## ai
[Full docs for ai](mcpx/ai.md)

- **Generate Code** `ai.generateCode`: Generate new code from a natural language prompt, specifying language and style.
- **Generate Structured Data** `ai.generateData`: Generate structured data (e.g., JSON) from a prompt and optional schema.
- **Generate Images** `ai.generateImages`: Generate images from a prompt using an AI model and optional parameters.
- **Generate Text** `ai.generateText`: Generate plain text from a prompt.
- **Refactor Code** `ai.refactorCode`: Refactor existing code based on instructions, language, and style.
- **Generate Tests** `ai.testCode`: Generate unit tests for code using the specified framework and language.
- **Write Documentation** `ai.writeDocumentation`: Write or update documentation for code in the specified format and audience.

## editor
[Full docs for editor](mcpx/editor.md)

- **Active File** `editor.activeFile`: Get the active editor file's path, languageId, and selected or full text.
- **Open File By Path** `editor.openFile`: Open a file in the editor by absolute path.
- **Open Virtual Document** `editor.openVirtual`: Open a read-only virtual document with content and language.
- **Propose Edits** `editor.proposeEdits`: Show a diff and ask the user to apply changes to a file in the workspace.
- **Editor Selection** `editor.editorSelection`: Get selection offsets and text for the active editor.

## git
[Full docs for git](mcpx/git.md)

- **Create Git Branch** `git.createGitBranch`: Create a new branch in the current repository using VS Code's Git extension.
- **Delete Git Branch** `git.deleteGitBranch`: Delete the specified branch in the current repository using VS Code's Git extension.
- **Merge Git Branch** `git.mergeGitBranch`: Merge the specified branch into the current branch using VS Code's Git extension.

## status
[Full docs for status](mcpx/status.md)

- **Show Status Bar** `status.showStatusBar`: Show a status message in the status bar. Optionally show a spinner.
- **Dismiss Status** `status.dismissStatus`: Dismiss any status notification by id.
- **Show Status Window** `status.showStatusWindow`: Show a status message in a window notification.

## ui
[Full docs for ui](mcpx/ui.md)

- **Show Info Message** `ui.showInfoMessage`: Show info message with optional actions.
- **Show Input Box** `ui.showInputBox`: Prompt user for a string input.
- **Show Warning Message** `ui.showWarningMessage`: Show warning message with optional actions.

## vcs
[Full docs for vcs](mcpx/vcs.md)

- **Commit Changes** `vcs.commitChanges`: Commit staged changes in the current repository with a message (supports any VCS provider).
- **Pull Changes** `vcs.pullChanges`: Pull changes from the remote repository (supports any VCS provider).
- **Push Changes** `vcs.pushChanges`: Push committed changes to the remote repository (supports any VCS provider).
- **VCS Status** `vcs.getVcsStatus`: Get the status of the current repository (supports any VCS provider).

## workspace
[Full docs for workspace](mcpx/workspace.md)

- **Create Workspace File** `workspace.createWorkspaceFile`: Create a new file in the workspace with optional content.
- **Delete Workspace File** `workspace.deleteWorkspaceFile`: Delete a file from the workspace.
- **List Workspace Files** `workspace.listWorkspaceFiles`: List files in the workspace matching a glob pattern.
- **List Workspace Folders** `workspace.listWorkspaceFolders`: List all workspace folders.
- **Rename Workspace Folder** `workspace.renameWorkspaceFolder`: Rename a folder in the workspace using VS Code's file system API (preserves user security permissions).

## fs
[Full docs for fs](mcpx/fs.md)

- **Find Files** `fs.findFiles`: Find files by glob pattern (workspace relative).
- **Read Directory** `fs.readDir`: List directory entries (name + kind).
- **Read File** `fs.readFile`: Read a UTF-8 file inside the workspace.
- **Write File** `fs.writeFile`: Write a UTF-8 file inside the workspace (with confirm).

## terminal
[Full docs for terminal](mcpx/terminal.md)

- **Close Terminal** `terminal.closeTerminal`: Close a specific integrated terminal in VS Code.
- **Create Terminal** `terminal.createTerminal`: Create a new integrated terminal in VS Code.
- **List Terminals** `terminal.listTerminals`: List all open integrated terminals in VS Code.
- **Send Text to Terminal** `terminal.sendTextToTerminal`: Send text or command to a specific integrated terminal.
- **Show Terminal** `terminal.showTerminal`: Show a specific integrated terminal in VS Code.

## github
[Full docs for github](mcpx/github.md)

- **Create GitHub Issue** `github.createGitHubIssue`: Create a new issue in a GitHub repository using VS Code's GitHub integration.
- **Create GitHub Pull Request** `github.createGitHubPullRequest`: Create a new pull request in a GitHub repository using VS Code's GitHub integration.
- **Open GitHub Repository** `github.openGitHubRepository`: Open a GitHub repository in the browser using VS Code's GitHub integration.

