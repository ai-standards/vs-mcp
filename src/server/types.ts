// AUTO-GENERATED FROM MCP TOOL INDEX. Do not edit by hand.

/** Generate new code from a natural language prompt, specifying language and style. */
export interface AiGenerateCodeProps {
  "prompt": string;
  "language"?: string;
  "style"?: string;
  "maxTokens"?: number;
}

export interface AiGenerateCodeResponse {
  "prompt": string;
  "language": string;
  "style"?: string;
  "maxTokens"?: number;
  "code": string;
}

/** Generate structured data (e.g., JSON) from a prompt and optional schema. */
export interface AiGenerateDataProps {
  "prompt": string;
  "schema"?: string;
  "maxTokens"?: number;
  "model"?: string;
  "temperature"?: number;
}

export interface AiGenerateDataResponse {
  "prompt": string;
  "schema"?: string;
  "maxTokens"?: number;
  "model"?: string;
  "temperature"?: number;
  "data": any;
}

/** Generate images from a prompt using an AI model and optional parameters. */
export interface AiGenerateImagesProps {
  "prompt": string;
  "count"?: number;
  "size"?: "512x512";
  "model"?: string;
}

export interface AiGenerateImagesResponse {
  "prompt": string;
  "count"?: number;
  "size"?: "512x512";
  "model"?: string;
  "images": any[];
  "note"?: string;
}

/** Generate plain text from a prompt. */
export interface AiGenerateTextProps {
  "prompt": string;
  "maxTokens"?: number;
  "model"?: string;
  "temperature"?: number;
}

export interface AiGenerateTextResponse {
  "prompt": string;
  "maxTokens"?: number;
  "model"?: string;
  "temperature"?: number;
  "text": string;
}

/** Refactor existing code based on instructions, language, and style. */
export interface AiRefactorCodeProps {
  "code": string;
  "instructions": string;
  "language"?: string;
  "style"?: string;
}

export interface AiRefactorCodeResponse {
  "code": string;
  "instructions": string;
  "language"?: string;
  "style"?: string;
  "refactoredCode": string;
}

/** Generate unit tests for code using the specified framework and language. */
export interface AiTestCodeProps {
  "code": string;
  "framework"?: string;
  "language"?: string;
}

export interface AiTestCodeResponse {
  "code": string;
  "framework"?: string;
  "language"?: string;
  "tests": string;
}

/** Write or update documentation for code in the specified format and audience. */
export interface AiWriteDocumentationProps {
  "code": string;
  "format"?: string;
  "audience"?: string;
}

export interface AiWriteDocumentationResponse {
  "code": string;
  "format"?: string;
  "audience"?: string;
  "docs": string;
}

/** Get the active editor file's path, languageId, and selected or full text. */
export interface EditorActiveFileProps {

}

export interface EditorActiveFileResponse {
  "__self": null;
}

/** Open a read-only virtual document with content and language. */
export interface EditorOpenVirtualProps {
  "content": string;
  "language"?: string;
}

export interface EditorOpenVirtualResponse {
  "content": string;
  "language"?: string;
  "ok": false;
}

/** Show a diff and ask the user to apply changes to a file in the workspace. */
export interface EditorProposeEditsProps {
  "targetPath": string;
  "newContent": string;
  "title"?: string;
  "workspaceRoot": string;
}

export interface EditorProposeEditsResponse {
  "targetPath": string;
  "newContent": string;
  "title"?: string;
  "workspaceRoot": string;
  "applied": false;
}

/** Get selection offsets and text for the active editor. */
export interface EditorEditorSelectionProps {

}

export interface EditorEditorSelectionResponse {
  "__self": null;
}

/** Create a new branch in the current repository using VS Code's Git extension. */
export interface GitCreateGitBranchProps {
  "branchName": string;
<<<<<<< Updated upstream
}

export interface GitCreateGitBranchResponse {
  "success": false;
  "error"?: string;
}

/** Delete the specified branch in the current repository using VS Code's Git extension. */
export interface GitDeleteGitBranchProps {
  "branchName": string;
}

export interface GitDeleteGitBranchResponse {
  "success": false;
  "error"?: string;
}

/** Merge the specified branch into the current branch using VS Code's Git extension. */
export interface GitMergeGitBranchProps {
  "branchName": string;
}

export interface GitMergeGitBranchResponse {
  "success": false;
  "error"?: string;
}

/** Find files by glob pattern (workspace relative). */
export interface FsFindFilesProps {
  "glob"?: string;
  "maxResults"?: number;
}

export interface FsFindFilesResponse {
  "files": string[];
}

/** List directory entries (name + kind). */
export interface FsReadDirProps {
  "dir": string;
  "workspaceRoot": string;
}

export interface FsReadDirResponse {
  "dir": string;
  "workspaceRoot": string;
  "items": { name: string; type: string; }[];
}

/** Read a UTF-8 file inside the workspace. */
export interface FsReadFileProps {
  "path": string;
  "workspaceRoot": string;
}

export interface FsReadFileResponse {
  "path": string;
  "workspaceRoot": string;
  "text": string;
}

/** Write a UTF-8 file inside the workspace (with confirm). */
export interface FsWriteFileProps {
  "path": string;
  "content": string;
  "workspaceRoot": string;
}

export interface FsWriteFileResponse {
  "path": string;
  "content": string;
  "workspaceRoot": string;
  "ok": false;
}

/** Show a status message in the status bar. Optionally show a spinner. */
export interface StatusShowStatusBarProps {
  "id": string;
  "message": string;
  "spinner"?: false;
}

export interface StatusShowStatusBarResponse {
  "id": string;
  "message": string;
  "spinner": false;
  "shown": false;
}

/** Dismiss any status notification by id. */
export interface StatusDismissStatusProps {
  "id": string;
}

export interface StatusDismissStatusResponse {
  "id": string;
  "dismissed": false;
}

/** Show a status message in a window notification. */
export interface StatusShowStatusWindowProps {
  "id": string;
  "message": string;
}

export interface StatusShowStatusWindowResponse {
  "id": string;
  "message": string;
  "shown": false;
}

/** Create a new issue in a GitHub repository using VS Code's GitHub integration. */
export interface GithubCreateGitHubIssueProps {
  "repository": string;
  "title": string;
  "body"?: string;
=======
>>>>>>> Stashed changes
}

export interface GitCreateGitBranchResponse {
  "success": false;
  "error"?: string;
}

/** Delete the specified branch in the current repository using VS Code's Git extension. */
export interface GitDeleteGitBranchProps {
  "branchName": string;
}

export interface GitDeleteGitBranchResponse {
  "success": false;
  "error"?: string;
}

/** Merge the specified branch into the current branch using VS Code's Git extension. */
export interface GitMergeGitBranchProps {
  "branchName": string;
}

export interface GitMergeGitBranchResponse {
  "success": false;
  "error"?: string;
}

/** Show a status message in the status bar. Optionally show a spinner. */
export interface StatusShowStatusBarProps {
  "id": string;
  "message": string;
  "spinner"?: false;
}

export interface StatusShowStatusBarResponse {
  "id": string;
  "message": string;
  "spinner": false;
  "shown": false;
}

/** Dismiss any status notification by id. */
export interface StatusDismissStatusProps {
  "id": string;
}

export interface StatusDismissStatusResponse {
  "id": string;
  "dismissed": false;
}

/** Show a status message in a window notification. */
export interface StatusShowStatusWindowProps {
  "id": string;
  "message": string;
}

export interface StatusShowStatusWindowResponse {
  "id": string;
  "message": string;
  "shown": false;
}

/** Show info message with optional actions. */
export interface UiShowInfoMessageProps {
  "message": string;
  "actions"?: string[];
}

export interface UiShowInfoMessageResponse {
  "choice": null;
}

/** Prompt user for a string input. */
export interface UiShowInputBoxProps {
  "prompt": string;
  "placeHolder"?: string;
}

export interface UiShowInputBoxResponse {
  "value": null;
}

/** Show warning message with optional actions. */
export interface UiShowWarningMessageProps {
  "message": string;
  "actions"?: string[];
}

export interface UiShowWarningMessageResponse {
  "choice": null;
}

/** Commit staged changes in the current repository with a message (supports any VCS provider). */
export interface VcsCommitChangesProps {
  "message": string;
}

export interface VcsCommitChangesResponse {
  "success": false;
  "error"?: string;
}

/** Pull changes from the remote repository (supports any VCS provider). */
export interface VcsPullChangesProps {

}

export interface VcsPullChangesResponse {
  "success": false;
  "error"?: string;
}

/** Push committed changes to the remote repository (supports any VCS provider). */
export interface VcsPushChangesProps {

}

export interface VcsPushChangesResponse {
  "success": false;
  "error"?: string;
}

/** Get the status of the current repository (supports any VCS provider). */
export interface VcsGetVcsStatusProps {

}

export interface VcsGetVcsStatusResponse {
  "status": string;
  "error"?: string;
}

/** Create a new file in the workspace with optional content. */
export interface WorkspaceCreateWorkspaceFileProps {
  "path": string;
  "content"?: string;
}

export interface WorkspaceCreateWorkspaceFileResponse {
  "success": false;
  "error"?: string;
}

/** Delete a file from the workspace. */
export interface WorkspaceDeleteWorkspaceFileProps {
  "path": string;
}

export interface WorkspaceDeleteWorkspaceFileResponse {
  "success": false;
  "error"?: string;
}

/** List files in the workspace matching a glob pattern. */
export interface WorkspaceListWorkspaceFilesProps {
  "glob"?: string;
}

export interface WorkspaceListWorkspaceFilesResponse {
  "files": string[];
}

/** List all workspace folders. */
export interface WorkspaceListWorkspaceFoldersProps {

}

export interface WorkspaceListWorkspaceFoldersResponse {
  "folders": string[];
}

/** Rename a folder in the workspace using VS Code's file system API (preserves user security permissions). */
export interface WorkspaceRenameWorkspaceFolderProps {
  "oldPath": string;
  "newPath": string;
}

export interface WorkspaceRenameWorkspaceFolderResponse {
  "success": false;
  "error"?: string;
}

<<<<<<< Updated upstream
export type ToolId = "ai.generateCode" | "ai.generateData" | "ai.generateImages" | "ai.generateText" | "ai.refactorCode" | "ai.testCode" | "ai.writeDocumentation" | "editor.activeFile" | "editor.openVirtual" | "editor.proposeEdits" | "editor.editorSelection" | "git.createGitBranch" | "git.deleteGitBranch" | "git.mergeGitBranch" | "fs.findFiles" | "fs.readDir" | "fs.readFile" | "fs.writeFile" | "status.showStatusBar" | "status.dismissStatus" | "status.showStatusWindow" | "github.createGitHubIssue" | "github.createGitHubPullRequest" | "github.openGitHubRepository" | "terminal.closeTerminal" | "terminal.createTerminal" | "terminal.listTerminals" | "terminal.sendTextToTerminal" | "terminal.showTerminal" | "ui.showInfoMessage" | "ui.showInputBox" | "ui.showWarningMessage" | "vcs.commitChanges" | "vcs.pullChanges" | "vcs.pushChanges" | "vcs.getVcsStatus" | "workspace.createWorkspaceFile" | "workspace.deleteWorkspaceFile" | "workspace.listWorkspaceFiles" | "workspace.listWorkspaceFolders" | "workspace.renameWorkspaceFolder";
=======
/** Find files by glob pattern (workspace relative). */
export interface FsFindFilesProps {
  "glob"?: string;
  "maxResults"?: number;
}

export interface FsFindFilesResponse {
  "files": string[];
}

/** List directory entries (name + kind). */
export interface FsReadDirProps {
  "dir": string;
  "workspaceRoot": string;
}

export interface FsReadDirResponse {
  "dir": string;
  "workspaceRoot": string;
  "items": { name: string; type: string; }[];
}

/** Read a UTF-8 file inside the workspace. */
export interface FsReadFileProps {
  "path": string;
  "workspaceRoot": string;
}

export interface FsReadFileResponse {
  "path": string;
  "workspaceRoot": string;
  "text": string;
}

/** Write a UTF-8 file inside the workspace (with confirm). */
export interface FsWriteFileProps {
  "path": string;
  "content": string;
  "workspaceRoot": string;
}

export interface FsWriteFileResponse {
  "path": string;
  "content": string;
  "workspaceRoot": string;
  "ok": false;
}

/** Close a specific integrated terminal in VS Code. */
export interface TerminalCloseTerminalProps {
  "terminalId": string;
}

export interface TerminalCloseTerminalResponse {
  "success": false;
}

/** Create a new integrated terminal in VS Code. */
export interface TerminalCreateTerminalProps {
  "name"?: string;
}

export interface TerminalCreateTerminalResponse {
  "terminalId": string;
}

/** List all open integrated terminals in VS Code. */
export interface TerminalListTerminalsProps {

}

export interface TerminalListTerminalsResponse {
  "terminals": string[];
}

/** Send text or command to a specific integrated terminal. */
export interface TerminalSendTextToTerminalProps {
  "terminalId": string;
  "text": string;
}

export interface TerminalSendTextToTerminalResponse {
  "success": false;
}

/** Show a specific integrated terminal in VS Code. */
export interface TerminalShowTerminalProps {
  "terminalId": string;
}

export interface TerminalShowTerminalResponse {
  "success": false;
}

/** Create a new issue in a GitHub repository using VS Code's GitHub integration. */
export interface GithubCreateGitHubIssueProps {
  "repository": string;
  "title": string;
  "body"?: string;
}

export interface GithubCreateGitHubIssueResponse {
  "issueUrl": null;
}

/** Create a new pull request in a GitHub repository using VS Code's GitHub integration. */
export interface GithubCreateGitHubPullRequestProps {
  "repository": string;
  "title": string;
  "body"?: string;
  "base"?: string;
  "head"?: string;
}

export interface GithubCreateGitHubPullRequestResponse {
  "prUrl": null;
}

/** Open a GitHub repository in the browser using VS Code's GitHub integration. */
export interface GithubOpenGitHubRepositoryProps {
  "repository": string;
}

export interface GithubOpenGitHubRepositoryResponse {
  "repoUrl": string;
}

export type ToolId = "agent.createAgent" | "agent.listAgents" | "agent.runAgent" | "ai.generateCode" | "ai.generateData" | "ai.generateImages" | "ai.generateText" | "ai.refactorCode" | "ai.testCode" | "ai.writeDocumentation" | "editor.activeFile" | "editor.openFile" | "editor.openVirtual" | "editor.proposeEdits" | "editor.editorSelection" | "git.createGitBranch" | "git.deleteGitBranch" | "git.mergeGitBranch" | "status.showStatusBar" | "status.dismissStatus" | "status.showStatusWindow" | "ui.showInfoMessage" | "ui.showInputBox" | "ui.showWarningMessage" | "vcs.commitChanges" | "vcs.pullChanges" | "vcs.pushChanges" | "vcs.getVcsStatus" | "workspace.createWorkspaceFile" | "workspace.deleteWorkspaceFile" | "workspace.listWorkspaceFiles" | "workspace.listWorkspaceFolders" | "workspace.renameWorkspaceFolder" | "fs.findFiles" | "fs.readDir" | "fs.readFile" | "fs.writeFile" | "terminal.closeTerminal" | "terminal.createTerminal" | "terminal.listTerminals" | "terminal.sendTextToTerminal" | "terminal.showTerminal" | "github.createGitHubIssue" | "github.createGitHubPullRequest" | "github.openGitHubRepository";
>>>>>>> Stashed changes
  
export type CommandMap = {
  "ai.generateCode": { props: AiGenerateCodeProps; response: AiGenerateCodeResponse; path: "src/tools/ai/generate-code.mcpx.ts" };
  "ai.generateData": { props: AiGenerateDataProps; response: AiGenerateDataResponse; path: "src/tools/ai/generate-data.mcpx.ts" };
  "ai.generateImages": { props: AiGenerateImagesProps; response: AiGenerateImagesResponse; path: "src/tools/ai/generate-images.mcpx.ts" };
  "ai.generateText": { props: AiGenerateTextProps; response: AiGenerateTextResponse; path: "src/tools/ai/generate-text.mcpx.ts" };
  "ai.refactorCode": { props: AiRefactorCodeProps; response: AiRefactorCodeResponse; path: "src/tools/ai/refactor-code.mcpx.ts" };
  "ai.testCode": { props: AiTestCodeProps; response: AiTestCodeResponse; path: "src/tools/ai/test-code.mcpx.ts" };
  "ai.writeDocumentation": { props: AiWriteDocumentationProps; response: AiWriteDocumentationResponse; path: "src/tools/ai/write-documentation.mcpx.ts" };
  "editor.activeFile": { props: EditorActiveFileProps; response: EditorActiveFileResponse; path: "src/tools/editor/active-file.mcpx.ts" };
  "editor.openVirtual": { props: EditorOpenVirtualProps; response: EditorOpenVirtualResponse; path: "src/tools/editor/open-virtual.mcpx.ts" };
  "editor.proposeEdits": { props: EditorProposeEditsProps; response: EditorProposeEditsResponse; path: "src/tools/editor/propose-edits.mcpx.ts" };
  "editor.editorSelection": { props: EditorEditorSelectionProps; response: EditorEditorSelectionResponse; path: "src/tools/editor/selection.mcpx.ts" };
  "git.createGitBranch": { props: GitCreateGitBranchProps; response: GitCreateGitBranchResponse; path: "src/tools/git/create-branch.mcpx.ts" };
  "git.deleteGitBranch": { props: GitDeleteGitBranchProps; response: GitDeleteGitBranchResponse; path: "src/tools/git/delete-branch.mcpx.ts" };
  "git.mergeGitBranch": { props: GitMergeGitBranchProps; response: GitMergeGitBranchResponse; path: "src/tools/git/merge-branch.mcpx.ts" };
<<<<<<< Updated upstream
  "fs.findFiles": { props: FsFindFilesProps; response: FsFindFilesResponse; path: "src/tools/fs/find.mcpx.ts" };
  "fs.readDir": { props: FsReadDirProps; response: FsReadDirResponse; path: "src/tools/fs/read-dir.mcpx.ts" };
  "fs.readFile": { props: FsReadFileProps; response: FsReadFileResponse; path: "src/tools/fs/read-file.mcpx.ts" };
  "fs.writeFile": { props: FsWriteFileProps; response: FsWriteFileResponse; path: "src/tools/fs/write-file.mcpx.ts" };
  "status.showStatusBar": { props: StatusShowStatusBarProps; response: StatusShowStatusBarResponse; path: "src/tools/status/bar.mcpx.ts" };
  "status.dismissStatus": { props: StatusDismissStatusProps; response: StatusDismissStatusResponse; path: "src/tools/status/dismiss.mcpx.ts" };
  "status.showStatusWindow": { props: StatusShowStatusWindowProps; response: StatusShowStatusWindowResponse; path: "src/tools/status/window.mcpx.ts" };
  "github.createGitHubIssue": { props: GithubCreateGitHubIssueProps; response: GithubCreateGitHubIssueResponse; path: "src/tools/github/create-issue.mcpx.ts" };
  "github.createGitHubPullRequest": { props: GithubCreateGitHubPullRequestProps; response: GithubCreateGitHubPullRequestResponse; path: "src/tools/github/create-pr.mcpx.ts" };
  "github.openGitHubRepository": { props: GithubOpenGitHubRepositoryProps; response: GithubOpenGitHubRepositoryResponse; path: "src/tools/github/open-repo.mcpx.ts" };
  "terminal.closeTerminal": { props: TerminalCloseTerminalProps; response: TerminalCloseTerminalResponse; path: "src/tools/terminal/close.mcpx.ts" };
  "terminal.createTerminal": { props: TerminalCreateTerminalProps; response: TerminalCreateTerminalResponse; path: "src/tools/terminal/create.mcpx.ts" };
  "terminal.listTerminals": { props: TerminalListTerminalsProps; response: TerminalListTerminalsResponse; path: "src/tools/terminal/list.mcpx.ts" };
  "terminal.sendTextToTerminal": { props: TerminalSendTextToTerminalProps; response: TerminalSendTextToTerminalResponse; path: "src/tools/terminal/send.mcpx.ts" };
  "terminal.showTerminal": { props: TerminalShowTerminalProps; response: TerminalShowTerminalResponse; path: "src/tools/terminal/show.mcpx.ts" };
=======
  "status.showStatusBar": { props: StatusShowStatusBarProps; response: StatusShowStatusBarResponse; path: "src/tools/status/bar.mcpx.ts" };
  "status.dismissStatus": { props: StatusDismissStatusProps; response: StatusDismissStatusResponse; path: "src/tools/status/dismiss.mcpx.ts" };
  "status.showStatusWindow": { props: StatusShowStatusWindowProps; response: StatusShowStatusWindowResponse; path: "src/tools/status/window.mcpx.ts" };
>>>>>>> Stashed changes
  "ui.showInfoMessage": { props: UiShowInfoMessageProps; response: UiShowInfoMessageResponse; path: "src/tools/ui/info.mcpx.ts" };
  "ui.showInputBox": { props: UiShowInputBoxProps; response: UiShowInputBoxResponse; path: "src/tools/ui/input.mcpx.ts" };
  "ui.showWarningMessage": { props: UiShowWarningMessageProps; response: UiShowWarningMessageResponse; path: "src/tools/ui/warn.mcpx.ts" };
  "vcs.commitChanges": { props: VcsCommitChangesProps; response: VcsCommitChangesResponse; path: "src/tools/vcs/commit.mcpx.ts" };
  "vcs.pullChanges": { props: VcsPullChangesProps; response: VcsPullChangesResponse; path: "src/tools/vcs/pull.mcpx.ts" };
  "vcs.pushChanges": { props: VcsPushChangesProps; response: VcsPushChangesResponse; path: "src/tools/vcs/push.mcpx.ts" };
  "vcs.getVcsStatus": { props: VcsGetVcsStatusProps; response: VcsGetVcsStatusResponse; path: "src/tools/vcs/status.mcpx.ts" };
  "workspace.createWorkspaceFile": { props: WorkspaceCreateWorkspaceFileProps; response: WorkspaceCreateWorkspaceFileResponse; path: "src/tools/workspace/create-file.mcpx.ts" };
  "workspace.deleteWorkspaceFile": { props: WorkspaceDeleteWorkspaceFileProps; response: WorkspaceDeleteWorkspaceFileResponse; path: "src/tools/workspace/delete-file.mcpx.ts" };
  "workspace.listWorkspaceFiles": { props: WorkspaceListWorkspaceFilesProps; response: WorkspaceListWorkspaceFilesResponse; path: "src/tools/workspace/list-files.mcpx.ts" };
  "workspace.listWorkspaceFolders": { props: WorkspaceListWorkspaceFoldersProps; response: WorkspaceListWorkspaceFoldersResponse; path: "src/tools/workspace/list-folders.mcpx.ts" };
  "workspace.renameWorkspaceFolder": { props: WorkspaceRenameWorkspaceFolderProps; response: WorkspaceRenameWorkspaceFolderResponse; path: "src/tools/workspace/rename-folder.mcpx.ts" };
<<<<<<< Updated upstream
=======
  "fs.findFiles": { props: FsFindFilesProps; response: FsFindFilesResponse; path: "src/tools/fs/find.mcpx.ts" };
  "fs.readDir": { props: FsReadDirProps; response: FsReadDirResponse; path: "src/tools/fs/read-dir.mcpx.ts" };
  "fs.readFile": { props: FsReadFileProps; response: FsReadFileResponse; path: "src/tools/fs/read-file.mcpx.ts" };
  "fs.writeFile": { props: FsWriteFileProps; response: FsWriteFileResponse; path: "src/tools/fs/write-file.mcpx.ts" };
  "terminal.closeTerminal": { props: TerminalCloseTerminalProps; response: TerminalCloseTerminalResponse; path: "src/tools/terminal/close.mcpx.ts" };
  "terminal.createTerminal": { props: TerminalCreateTerminalProps; response: TerminalCreateTerminalResponse; path: "src/tools/terminal/create.mcpx.ts" };
  "terminal.listTerminals": { props: TerminalListTerminalsProps; response: TerminalListTerminalsResponse; path: "src/tools/terminal/list.mcpx.ts" };
  "terminal.sendTextToTerminal": { props: TerminalSendTextToTerminalProps; response: TerminalSendTextToTerminalResponse; path: "src/tools/terminal/send.mcpx.ts" };
  "terminal.showTerminal": { props: TerminalShowTerminalProps; response: TerminalShowTerminalResponse; path: "src/tools/terminal/show.mcpx.ts" };
  "github.createGitHubIssue": { props: GithubCreateGitHubIssueProps; response: GithubCreateGitHubIssueResponse; path: "src/tools/github/create-issue.mcpx.ts" };
  "github.createGitHubPullRequest": { props: GithubCreateGitHubPullRequestProps; response: GithubCreateGitHubPullRequestResponse; path: "src/tools/github/create-pr.mcpx.ts" };
  "github.openGitHubRepository": { props: GithubOpenGitHubRepositoryProps; response: GithubOpenGitHubRepositoryResponse; path: "src/tools/github/open-repo.mcpx.ts" };
>>>>>>> Stashed changes
};

type AiGenerateCodePropsKey = "ai.generateCodeProps";
type AiGenerateCodeResponseKey = "ai.generateCodeResponse";
type AiGenerateDataPropsKey = "ai.generateDataProps";
type AiGenerateDataResponseKey = "ai.generateDataResponse";
type AiGenerateImagesPropsKey = "ai.generateImagesProps";
type AiGenerateImagesResponseKey = "ai.generateImagesResponse";
type AiGenerateTextPropsKey = "ai.generateTextProps";
type AiGenerateTextResponseKey = "ai.generateTextResponse";
type AiRefactorCodePropsKey = "ai.refactorCodeProps";
type AiRefactorCodeResponseKey = "ai.refactorCodeResponse";
type AiTestCodePropsKey = "ai.testCodeProps";
type AiTestCodeResponseKey = "ai.testCodeResponse";
type AiWriteDocumentationPropsKey = "ai.writeDocumentationProps";
type AiWriteDocumentationResponseKey = "ai.writeDocumentationResponse";
type EditorActiveFilePropsKey = "editor.activeFileProps";
type EditorActiveFileResponseKey = "editor.activeFileResponse";
type EditorOpenVirtualPropsKey = "editor.openVirtualProps";
type EditorOpenVirtualResponseKey = "editor.openVirtualResponse";
type EditorProposeEditsPropsKey = "editor.proposeEditsProps";
type EditorProposeEditsResponseKey = "editor.proposeEditsResponse";
type EditorEditorSelectionPropsKey = "editor.editorSelectionProps";
type EditorEditorSelectionResponseKey = "editor.editorSelectionResponse";
type GitCreateGitBranchPropsKey = "git.createGitBranchProps";
type GitCreateGitBranchResponseKey = "git.createGitBranchResponse";
type GitDeleteGitBranchPropsKey = "git.deleteGitBranchProps";
type GitDeleteGitBranchResponseKey = "git.deleteGitBranchResponse";
type GitMergeGitBranchPropsKey = "git.mergeGitBranchProps";
type GitMergeGitBranchResponseKey = "git.mergeGitBranchResponse";
<<<<<<< Updated upstream
type FsFindFilesPropsKey = "fs.findFilesProps";
type FsFindFilesResponseKey = "fs.findFilesResponse";
type FsReadDirPropsKey = "fs.readDirProps";
type FsReadDirResponseKey = "fs.readDirResponse";
type FsReadFilePropsKey = "fs.readFileProps";
type FsReadFileResponseKey = "fs.readFileResponse";
type FsWriteFilePropsKey = "fs.writeFileProps";
type FsWriteFileResponseKey = "fs.writeFileResponse";
=======
>>>>>>> Stashed changes
type StatusShowStatusBarPropsKey = "status.showStatusBarProps";
type StatusShowStatusBarResponseKey = "status.showStatusBarResponse";
type StatusDismissStatusPropsKey = "status.dismissStatusProps";
type StatusDismissStatusResponseKey = "status.dismissStatusResponse";
type StatusShowStatusWindowPropsKey = "status.showStatusWindowProps";
type StatusShowStatusWindowResponseKey = "status.showStatusWindowResponse";
<<<<<<< Updated upstream
type GithubCreateGitHubIssuePropsKey = "github.createGitHubIssueProps";
type GithubCreateGitHubIssueResponseKey = "github.createGitHubIssueResponse";
type GithubCreateGitHubPullRequestPropsKey = "github.createGitHubPullRequestProps";
type GithubCreateGitHubPullRequestResponseKey = "github.createGitHubPullRequestResponse";
type GithubOpenGitHubRepositoryPropsKey = "github.openGitHubRepositoryProps";
type GithubOpenGitHubRepositoryResponseKey = "github.openGitHubRepositoryResponse";
type TerminalCloseTerminalPropsKey = "terminal.closeTerminalProps";
type TerminalCloseTerminalResponseKey = "terminal.closeTerminalResponse";
type TerminalCreateTerminalPropsKey = "terminal.createTerminalProps";
type TerminalCreateTerminalResponseKey = "terminal.createTerminalResponse";
type TerminalListTerminalsPropsKey = "terminal.listTerminalsProps";
type TerminalListTerminalsResponseKey = "terminal.listTerminalsResponse";
type TerminalSendTextToTerminalPropsKey = "terminal.sendTextToTerminalProps";
type TerminalSendTextToTerminalResponseKey = "terminal.sendTextToTerminalResponse";
type TerminalShowTerminalPropsKey = "terminal.showTerminalProps";
type TerminalShowTerminalResponseKey = "terminal.showTerminalResponse";
=======
>>>>>>> Stashed changes
type UiShowInfoMessagePropsKey = "ui.showInfoMessageProps";
type UiShowInfoMessageResponseKey = "ui.showInfoMessageResponse";
type UiShowInputBoxPropsKey = "ui.showInputBoxProps";
type UiShowInputBoxResponseKey = "ui.showInputBoxResponse";
type UiShowWarningMessagePropsKey = "ui.showWarningMessageProps";
type UiShowWarningMessageResponseKey = "ui.showWarningMessageResponse";
type VcsCommitChangesPropsKey = "vcs.commitChangesProps";
type VcsCommitChangesResponseKey = "vcs.commitChangesResponse";
type VcsPullChangesPropsKey = "vcs.pullChangesProps";
type VcsPullChangesResponseKey = "vcs.pullChangesResponse";
type VcsPushChangesPropsKey = "vcs.pushChangesProps";
type VcsPushChangesResponseKey = "vcs.pushChangesResponse";
type VcsGetVcsStatusPropsKey = "vcs.getVcsStatusProps";
type VcsGetVcsStatusResponseKey = "vcs.getVcsStatusResponse";
type WorkspaceCreateWorkspaceFilePropsKey = "workspace.createWorkspaceFileProps";
type WorkspaceCreateWorkspaceFileResponseKey = "workspace.createWorkspaceFileResponse";
type WorkspaceDeleteWorkspaceFilePropsKey = "workspace.deleteWorkspaceFileProps";
type WorkspaceDeleteWorkspaceFileResponseKey = "workspace.deleteWorkspaceFileResponse";
type WorkspaceListWorkspaceFilesPropsKey = "workspace.listWorkspaceFilesProps";
type WorkspaceListWorkspaceFilesResponseKey = "workspace.listWorkspaceFilesResponse";
type WorkspaceListWorkspaceFoldersPropsKey = "workspace.listWorkspaceFoldersProps";
type WorkspaceListWorkspaceFoldersResponseKey = "workspace.listWorkspaceFoldersResponse";
type WorkspaceRenameWorkspaceFolderPropsKey = "workspace.renameWorkspaceFolderProps";
type WorkspaceRenameWorkspaceFolderResponseKey = "workspace.renameWorkspaceFolderResponse";
<<<<<<< Updated upstream
=======
type FsFindFilesPropsKey = "fs.findFilesProps";
type FsFindFilesResponseKey = "fs.findFilesResponse";
type FsReadDirPropsKey = "fs.readDirProps";
type FsReadDirResponseKey = "fs.readDirResponse";
type FsReadFilePropsKey = "fs.readFileProps";
type FsReadFileResponseKey = "fs.readFileResponse";
type FsWriteFilePropsKey = "fs.writeFileProps";
type FsWriteFileResponseKey = "fs.writeFileResponse";
type TerminalCloseTerminalPropsKey = "terminal.closeTerminalProps";
type TerminalCloseTerminalResponseKey = "terminal.closeTerminalResponse";
type TerminalCreateTerminalPropsKey = "terminal.createTerminalProps";
type TerminalCreateTerminalResponseKey = "terminal.createTerminalResponse";
type TerminalListTerminalsPropsKey = "terminal.listTerminalsProps";
type TerminalListTerminalsResponseKey = "terminal.listTerminalsResponse";
type TerminalSendTextToTerminalPropsKey = "terminal.sendTextToTerminalProps";
type TerminalSendTextToTerminalResponseKey = "terminal.sendTextToTerminalResponse";
type TerminalShowTerminalPropsKey = "terminal.showTerminalProps";
type TerminalShowTerminalResponseKey = "terminal.showTerminalResponse";
type GithubCreateGitHubIssuePropsKey = "github.createGitHubIssueProps";
type GithubCreateGitHubIssueResponseKey = "github.createGitHubIssueResponse";
type GithubCreateGitHubPullRequestPropsKey = "github.createGitHubPullRequestProps";
type GithubCreateGitHubPullRequestResponseKey = "github.createGitHubPullRequestResponse";
type GithubOpenGitHubRepositoryPropsKey = "github.openGitHubRepositoryProps";
type GithubOpenGitHubRepositoryResponseKey = "github.openGitHubRepositoryResponse";
>>>>>>> Stashed changes

export type PropsFor<K extends keyof CommandMap> =
  { [P in `${Extract<K, string>}Props`]: CommandMap[K]["props"] };

export type ResponseFor<K extends keyof CommandMap> =
  { [R in `${Extract<K, string>}Response`]: CommandMap[K]["response"] };

/** Type-stable signature; implement elsewhere to dispatch to your actual tools. */
export async function runTool<K extends keyof CommandMap>(
  name: K,
  args: PropsFor<K>
): Promise<ResponseFor<K>> {
  throw new Error("runTool is a type-only stub generated by generateMcpTypes()");
}

export type ToolDescriptor = {
  id: ToolId;
  path: CommandMap[ToolId]["path"];
  name?: string;
  description?: string;
};

export const AllTools = [
  {
    "id": "generateCode",
    "namespace": "ai",
    "path": "src/tools/ai/generate-code.mcpx.ts",
    "name": "Generate Code",
    "description": "Generate new code from a natural language prompt, specifying language and style."
  },
  {
    "id": "generateData",
    "namespace": "ai",
    "path": "src/tools/ai/generate-data.mcpx.ts",
    "name": "Generate Structured Data",
    "description": "Generate structured data (e.g., JSON) from a prompt and optional schema."
  },
  {
    "id": "generateImages",
    "namespace": "ai",
    "path": "src/tools/ai/generate-images.mcpx.ts",
    "name": "Generate Images",
    "description": "Generate images from a prompt using an AI model and optional parameters."
  },
  {
    "id": "generateText",
    "namespace": "ai",
    "path": "src/tools/ai/generate-text.mcpx.ts",
    "name": "Generate Text",
    "description": "Generate plain text from a prompt."
  },
  {
    "id": "refactorCode",
    "namespace": "ai",
    "path": "src/tools/ai/refactor-code.mcpx.ts",
    "name": "Refactor Code",
    "description": "Refactor existing code based on instructions, language, and style."
  },
  {
    "id": "testCode",
    "namespace": "ai",
    "path": "src/tools/ai/test-code.mcpx.ts",
    "name": "Generate Tests",
    "description": "Generate unit tests for code using the specified framework and language."
  },
  {
    "id": "writeDocumentation",
    "namespace": "ai",
    "path": "src/tools/ai/write-documentation.mcpx.ts",
    "name": "Write Documentation",
    "description": "Write or update documentation for code in the specified format and audience."
  },
  {
    "id": "activeFile",
    "namespace": "editor",
    "path": "src/tools/editor/active-file.mcpx.ts",
    "name": "Active File",
    "description": "Get the active editor file's path, languageId, and selected or full text."
  },
  {
    "id": "openVirtual",
    "namespace": "editor",
    "path": "src/tools/editor/open-virtual.mcpx.ts",
    "name": "Open Virtual Document",
    "description": "Open a read-only virtual document with content and language."
  },
  {
    "id": "proposeEdits",
    "namespace": "editor",
    "path": "src/tools/editor/propose-edits.mcpx.ts",
    "name": "Propose Edits",
    "description": "Show a diff and ask the user to apply changes to a file in the workspace."
  },
  {
    "id": "editorSelection",
    "namespace": "editor",
    "path": "src/tools/editor/selection.mcpx.ts",
    "name": "Editor Selection",
<<<<<<< Updated upstream
    "description": "Get selection offsets and text for the active editor."
=======
    "description": "Get selection offsets and text for the active editor.",
    "input": {},
    "output": {
      "__self": {
        "type": "null",
        "required": true
      }
    }
>>>>>>> Stashed changes
  },
  {
    "id": "createGitBranch",
    "namespace": "git",
    "path": "src/tools/git/create-branch.mcpx.ts",
    "name": "Create Git Branch",
<<<<<<< Updated upstream
    "description": "Create a new branch in the current repository using VS Code's Git extension."
=======
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
>>>>>>> Stashed changes
  },
  {
    "id": "deleteGitBranch",
    "namespace": "git",
    "path": "src/tools/git/delete-branch.mcpx.ts",
    "name": "Delete Git Branch",
<<<<<<< Updated upstream
    "description": "Delete the specified branch in the current repository using VS Code's Git extension."
=======
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
>>>>>>> Stashed changes
  },
  {
    "id": "mergeGitBranch",
    "namespace": "git",
    "path": "src/tools/git/merge-branch.mcpx.ts",
    "name": "Merge Git Branch",
<<<<<<< Updated upstream
    "description": "Merge the specified branch into the current branch using VS Code's Git extension."
=======
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
    "id": "showStatusBar",
    "namespace": "status",
    "path": "src/tools/status/bar.mcpx.ts",
    "name": "Show Status Bar",
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
    "namespace": "status",
    "path": "src/tools/status/dismiss.mcpx.ts",
    "name": "Dismiss Status",
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
    "namespace": "status",
    "path": "src/tools/status/window.mcpx.ts",
    "name": "Show Status Window",
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
    "id": "showInfoMessage",
    "namespace": "ui",
    "path": "src/tools/ui/info.mcpx.ts",
    "name": "Show Info Message",
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
    "namespace": "ui",
    "path": "src/tools/ui/input.mcpx.ts",
    "name": "Show Input Box",
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
    "namespace": "ui",
    "path": "src/tools/ui/warn.mcpx.ts",
    "name": "Show Warning Message",
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
    "namespace": "vcs",
    "path": "src/tools/vcs/commit.mcpx.ts",
    "name": "Commit Changes",
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
    "namespace": "vcs",
    "path": "src/tools/vcs/pull.mcpx.ts",
    "name": "Pull Changes",
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
    "namespace": "vcs",
    "path": "src/tools/vcs/push.mcpx.ts",
    "name": "Push Changes",
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
    "namespace": "vcs",
    "path": "src/tools/vcs/status.mcpx.ts",
    "name": "VCS Status",
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
    "id": "createWorkspaceFile",
    "namespace": "workspace",
    "path": "src/tools/workspace/create-file.mcpx.ts",
    "name": "Create Workspace File",
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
    "namespace": "workspace",
    "path": "src/tools/workspace/delete-file.mcpx.ts",
    "name": "Delete Workspace File",
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
    "namespace": "workspace",
    "path": "src/tools/workspace/list-files.mcpx.ts",
    "name": "List Workspace Files",
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
    "namespace": "workspace",
    "path": "src/tools/workspace/list-folders.mcpx.ts",
    "name": "List Workspace Folders",
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
    "namespace": "workspace",
    "path": "src/tools/workspace/rename-folder.mcpx.ts",
    "name": "Rename Workspace Folder",
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
>>>>>>> Stashed changes
  },
  {
    "id": "findFiles",
    "namespace": "fs",
    "path": "src/tools/fs/find.mcpx.ts",
    "name": "Find Files",
    "description": "Find files by glob pattern (workspace relative)."
  },
  {
    "id": "readDir",
    "namespace": "fs",
    "path": "src/tools/fs/read-dir.mcpx.ts",
    "name": "Read Directory",
    "description": "List directory entries (name + kind)."
  },
  {
    "id": "readFile",
    "namespace": "fs",
    "path": "src/tools/fs/read-file.mcpx.ts",
    "name": "Read File",
    "description": "Read a UTF-8 file inside the workspace."
  },
  {
    "id": "writeFile",
    "namespace": "fs",
    "path": "src/tools/fs/write-file.mcpx.ts",
    "name": "Write File",
<<<<<<< Updated upstream
    "description": "Write a UTF-8 file inside the workspace (with confirm)."
  },
  {
    "id": "showStatusBar",
    "namespace": "status",
    "path": "src/tools/status/bar.mcpx.ts",
    "name": "Show Status Bar",
    "description": "Show a status message in the status bar. Optionally show a spinner."
  },
  {
    "id": "dismissStatus",
    "namespace": "status",
    "path": "src/tools/status/dismiss.mcpx.ts",
    "name": "Dismiss Status",
    "description": "Dismiss any status notification by id."
  },
  {
    "id": "showStatusWindow",
    "namespace": "status",
    "path": "src/tools/status/window.mcpx.ts",
    "name": "Show Status Window",
    "description": "Show a status message in a window notification."
  },
  {
    "id": "createGitHubIssue",
    "namespace": "github",
    "path": "src/tools/github/create-issue.mcpx.ts",
    "name": "Create GitHub Issue",
    "description": "Create a new issue in a GitHub repository using VS Code's GitHub integration."
  },
  {
    "id": "createGitHubPullRequest",
    "namespace": "github",
    "path": "src/tools/github/create-pr.mcpx.ts",
    "name": "Create GitHub Pull Request",
    "description": "Create a new pull request in a GitHub repository using VS Code's GitHub integration."
  },
  {
    "id": "openGitHubRepository",
    "namespace": "github",
    "path": "src/tools/github/open-repo.mcpx.ts",
    "name": "Open GitHub Repository",
    "description": "Open a GitHub repository in the browser using VS Code's GitHub integration."
=======
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
>>>>>>> Stashed changes
  },
  {
    "id": "closeTerminal",
    "namespace": "terminal",
    "path": "src/tools/terminal/close.mcpx.ts",
    "name": "Close Terminal",
<<<<<<< Updated upstream
    "description": "Close a specific integrated terminal in VS Code."
=======
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
>>>>>>> Stashed changes
  },
  {
    "id": "createTerminal",
    "namespace": "terminal",
    "path": "src/tools/terminal/create.mcpx.ts",
    "name": "Create Terminal",
<<<<<<< Updated upstream
    "description": "Create a new integrated terminal in VS Code."
=======
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
>>>>>>> Stashed changes
  },
  {
    "id": "listTerminals",
    "namespace": "terminal",
    "path": "src/tools/terminal/list.mcpx.ts",
    "name": "List Terminals",
<<<<<<< Updated upstream
    "description": "List all open integrated terminals in VS Code."
=======
    "description": "List all open integrated terminals in VS Code.",
    "input": {},
    "output": {
      "terminals": {
        "type": "string[]",
        "required": true
      }
    }
>>>>>>> Stashed changes
  },
  {
    "id": "sendTextToTerminal",
    "namespace": "terminal",
    "path": "src/tools/terminal/send.mcpx.ts",
    "name": "Send Text to Terminal",
<<<<<<< Updated upstream
    "description": "Send text or command to a specific integrated terminal."
=======
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
>>>>>>> Stashed changes
  },
  {
    "id": "showTerminal",
    "namespace": "terminal",
    "path": "src/tools/terminal/show.mcpx.ts",
    "name": "Show Terminal",
<<<<<<< Updated upstream
    "description": "Show a specific integrated terminal in VS Code."
  },
  {
    "id": "showInfoMessage",
    "namespace": "ui",
    "path": "src/tools/ui/info.mcpx.ts",
    "name": "Show Info Message",
    "description": "Show info message with optional actions."
  },
  {
    "id": "showInputBox",
    "namespace": "ui",
    "path": "src/tools/ui/input.mcpx.ts",
    "name": "Show Input Box",
    "description": "Prompt user for a string input."
  },
  {
    "id": "showWarningMessage",
    "namespace": "ui",
    "path": "src/tools/ui/warn.mcpx.ts",
    "name": "Show Warning Message",
    "description": "Show warning message with optional actions."
  },
  {
    "id": "commitChanges",
    "namespace": "vcs",
    "path": "src/tools/vcs/commit.mcpx.ts",
    "name": "Commit Changes",
    "description": "Commit staged changes in the current repository with a message (supports any VCS provider)."
  },
  {
    "id": "pullChanges",
    "namespace": "vcs",
    "path": "src/tools/vcs/pull.mcpx.ts",
    "name": "Pull Changes",
    "description": "Pull changes from the remote repository (supports any VCS provider)."
  },
  {
    "id": "pushChanges",
    "namespace": "vcs",
    "path": "src/tools/vcs/push.mcpx.ts",
    "name": "Push Changes",
    "description": "Push committed changes to the remote repository (supports any VCS provider)."
  },
  {
    "id": "getVcsStatus",
    "namespace": "vcs",
    "path": "src/tools/vcs/status.mcpx.ts",
    "name": "VCS Status",
    "description": "Get the status of the current repository (supports any VCS provider)."
  },
  {
    "id": "createWorkspaceFile",
    "namespace": "workspace",
    "path": "src/tools/workspace/create-file.mcpx.ts",
    "name": "Create Workspace File",
    "description": "Create a new file in the workspace with optional content."
  },
  {
    "id": "deleteWorkspaceFile",
    "namespace": "workspace",
    "path": "src/tools/workspace/delete-file.mcpx.ts",
    "name": "Delete Workspace File",
    "description": "Delete a file from the workspace."
  },
  {
    "id": "listWorkspaceFiles",
    "namespace": "workspace",
    "path": "src/tools/workspace/list-files.mcpx.ts",
    "name": "List Workspace Files",
    "description": "List files in the workspace matching a glob pattern."
  },
  {
    "id": "listWorkspaceFolders",
    "namespace": "workspace",
    "path": "src/tools/workspace/list-folders.mcpx.ts",
    "name": "List Workspace Folders",
    "description": "List all workspace folders."
  },
  {
    "id": "renameWorkspaceFolder",
    "namespace": "workspace",
    "path": "src/tools/workspace/rename-folder.mcpx.ts",
    "name": "Rename Workspace Folder",
    "description": "Rename a folder in the workspace using VS Code's file system API (preserves user security permissions)."
=======
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
    "id": "createGitHubIssue",
    "namespace": "github",
    "path": "src/tools/github/create-issue.mcpx.ts",
    "name": "Create GitHub Issue",
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
    "namespace": "github",
    "path": "src/tools/github/create-pr.mcpx.ts",
    "name": "Create GitHub Pull Request",
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
    "namespace": "github",
    "path": "src/tools/github/open-repo.mcpx.ts",
    "name": "Open GitHub Repository",
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
>>>>>>> Stashed changes
  }
] as const;
