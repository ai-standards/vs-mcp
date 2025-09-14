// AUTO-GENERATED FROM MCP TOOL INDEX. Do not edit by hand.

/** Generate new code from a natural language prompt, specifying language and style. */
export interface GenerateCodeProps {
  "prompt": string;
  "language"?: string;
  "style"?: string;
  "maxTokens"?: number;
}

export interface GenerateCodeResponse {
  "prompt": string;
  "language": string;
  "style"?: string;
  "maxTokens"?: number;
  "code": string;
}

/** Generate structured data (e.g., JSON) from a prompt and optional schema. */
export interface GenerateDataProps {
  "prompt": string;
  "schema"?: string;
  "maxTokens"?: number;
  "model"?: string;
  "temperature"?: number;
}

export interface GenerateDataResponse {
  "prompt": string;
  "schema"?: string;
  "maxTokens"?: number;
  "model"?: string;
  "temperature"?: number;
  "data": any;
}

/** Generate images from a prompt using an AI model and optional parameters. */
export interface GenerateImagesProps {
  "prompt": string;
  "count"?: number;
  "size"?: "512x512";
  "model"?: string;
}

export interface GenerateImagesResponse {
  "prompt": string;
  "count"?: number;
  "size"?: "512x512";
  "model"?: string;
  "images": any[];
  "note"?: string;
}

/** Generate plain text from a prompt. */
export interface GenerateTextProps {
  "prompt": string;
  "maxTokens"?: number;
  "model"?: string;
  "temperature"?: number;
}

export interface GenerateTextResponse {
  "prompt": string;
  "maxTokens"?: number;
  "model"?: string;
  "temperature"?: number;
  "text": string;
}

/** Refactor existing code based on instructions, language, and style. */
export interface RefactorCodeProps {
  "code": string;
  "instructions": string;
  "language"?: string;
  "style"?: string;
}

export interface RefactorCodeResponse {
  "code": string;
  "instructions": string;
  "language"?: string;
  "style"?: string;
  "refactoredCode": string;
}

/** Generate unit tests for code using the specified framework and language. */
export interface TestCodeProps {
  "code": string;
  "framework"?: string;
  "language"?: string;
}

export interface TestCodeResponse {
  "code": string;
  "framework"?: string;
  "language"?: string;
  "tests": string;
}

/** Write or update documentation for code in the specified format and audience. */
export interface WriteDocumentationProps {
  "code": string;
  "format"?: string;
  "audience"?: string;
}

export interface WriteDocumentationResponse {
  "code": string;
  "format"?: string;
  "audience"?: string;
  "docs": string;
}

/** Get the active editor file's path, languageId, and selected or full text. */
export interface ActiveFileProps {

}

export interface ActiveFileResponse {
  "__self": null;
}

/** Open a read-only virtual document with content and language. */
export interface OpenVirtualProps {
  "content": string;
  "language"?: string;
}

export interface OpenVirtualResponse {
  "content": string;
  "language"?: string;
  "ok": false;
}

/** Show a diff and ask the user to apply changes to a file in the workspace. */
export interface ProposeEditsProps {
  "targetPath": string;
  "newContent": string;
  "title"?: string;
  "workspaceRoot": string;
}

export interface ProposeEditsResponse {
  "targetPath": string;
  "newContent": string;
  "title"?: string;
  "workspaceRoot": string;
  "applied": false;
}

/** Get selection offsets and text for the active editor. */
export interface EditorSelectionProps {

}

export interface EditorSelectionResponse {
  "__self": null;
}

/** Find files by glob pattern (workspace relative). */
export interface FindFilesProps {
  "glob"?: string;
  "maxResults"?: number;
}

export interface FindFilesResponse {
  "files": string[];
}

/** List directory entries (name + kind). */
export interface ReadDirProps {
  "dir": string;
  "workspaceRoot": string;
}

export interface ReadDirResponse {
  "dir": string;
  "workspaceRoot": string;
  "items": { name: string; type: string; }[];
}

/** Read a UTF-8 file inside the workspace. */
export interface ReadFileProps {
  "path": string;
  "workspaceRoot": string;
}

export interface ReadFileResponse {
  "path": string;
  "workspaceRoot": string;
  "text": string;
}

/** Write a UTF-8 file inside the workspace (with confirm). */
export interface WriteFileProps {
  "path": string;
  "content": string;
  "workspaceRoot": string;
}

export interface WriteFileResponse {
  "path": string;
  "content": string;
  "workspaceRoot": string;
  "ok": false;
}

/** Show a status message in the status bar. Optionally show a spinner. */
export interface ShowStatusBarProps {
  "id": string;
  "message": string;
  "spinner"?: false;
}

export interface ShowStatusBarResponse {
  "id": string;
  "message": string;
  "spinner": false;
  "shown": false;
}

/** Dismiss any status notification by id. */
export interface DismissStatusProps {
  "id": string;
}

export interface DismissStatusResponse {
  "id": string;
  "dismissed": false;
}

/** Show a status message in a window notification. */
export interface ShowStatusWindowProps {
  "id": string;
  "message": string;
}

export interface ShowStatusWindowResponse {
  "id": string;
  "message": string;
  "shown": false;
}

/** Show info message with optional actions. */
export interface ShowInfoMessageProps {
  "message": string;
  "actions"?: string[];
}

export interface ShowInfoMessageResponse {
  "choice": null;
}

/** Prompt user for a string input. */
export interface ShowInputBoxProps {
  "prompt": string;
  "placeHolder"?: string;
}

export interface ShowInputBoxResponse {
  "value": null;
}

/** Show warning message with optional actions. */
export interface ShowWarningMessageProps {
  "message": string;
  "actions"?: string[];
}

export interface ShowWarningMessageResponse {
  "choice": null;
}

/** Commit staged changes in the current repository with a message (supports any VCS provider). */
export interface CommitChangesProps {
  "message": string;
}

export interface CommitChangesResponse {
  "success": false;
  "error"?: string;
}

/** Pull changes from the remote repository (supports any VCS provider). */
export interface PullChangesProps {

}

export interface PullChangesResponse {
  "success": false;
  "error"?: string;
}

/** Push committed changes to the remote repository (supports any VCS provider). */
export interface PushChangesProps {

}

export interface PushChangesResponse {
  "success": false;
  "error"?: string;
}

/** Get the status of the current repository (supports any VCS provider). */
export interface GetVcsStatusProps {

}

export interface GetVcsStatusResponse {
  "status": string;
  "error"?: string;
}

/** Create a new file in the workspace with optional content. */
export interface CreateWorkspaceFileProps {
  "path": string;
  "content"?: string;
}

export interface CreateWorkspaceFileResponse {
  "success": false;
  "error"?: string;
}

/** Delete a file from the workspace. */
export interface DeleteWorkspaceFileProps {
  "path": string;
}

export interface DeleteWorkspaceFileResponse {
  "success": false;
  "error"?: string;
}

/** List files in the workspace matching a glob pattern. */
export interface ListWorkspaceFilesProps {
  "glob"?: string;
}

export interface ListWorkspaceFilesResponse {
  "files": string[];
}

/** List all workspace folders. */
export interface ListWorkspaceFoldersProps {

}

export interface ListWorkspaceFoldersResponse {
  "folders": string[];
}

/** Rename a folder in the workspace using VS Code's file system API (preserves user security permissions). */
export interface RenameWorkspaceFolderProps {
  "oldPath": string;
  "newPath": string;
}

export interface RenameWorkspaceFolderResponse {
  "success": false;
  "error"?: string;
}

/** Create a new branch in the current repository using VS Code's Git extension. */
export interface CreateGitBranchProps {
  "branchName": string;
}

export interface CreateGitBranchResponse {
  "success": false;
  "error"?: string;
}

/** Delete the specified branch in the current repository using VS Code's Git extension. */
export interface DeleteGitBranchProps {
  "branchName": string;
}

export interface DeleteGitBranchResponse {
  "success": false;
  "error"?: string;
}

/** Merge the specified branch into the current branch using VS Code's Git extension. */
export interface MergeGitBranchProps {
  "branchName": string;
}

export interface MergeGitBranchResponse {
  "success": false;
  "error"?: string;
}

/** Close a specific integrated terminal in VS Code. */
export interface CloseTerminalProps {
  "terminalId": string;
}

export interface CloseTerminalResponse {
  "success": false;
}

/** Create a new integrated terminal in VS Code. */
export interface CreateTerminalProps {
  "name"?: string;
}

export interface CreateTerminalResponse {
  "terminalId": string;
}

/** List all open integrated terminals in VS Code. */
export interface ListTerminalsProps {

}

export interface ListTerminalsResponse {
  "terminals": string[];
}

/** Send text or command to a specific integrated terminal. */
export interface SendTextToTerminalProps {
  "terminalId": string;
  "text": string;
}

export interface SendTextToTerminalResponse {
  "success": false;
}

/** Show a specific integrated terminal in VS Code. */
export interface ShowTerminalProps {
  "terminalId": string;
}

export interface ShowTerminalResponse {
  "success": false;
}

/** Create a new issue in a GitHub repository using VS Code's GitHub integration. */
export interface CreateGitHubIssueProps {
  "repository": string;
  "title": string;
  "body"?: string;
}

export interface CreateGitHubIssueResponse {
  "issueUrl": null;
}

/** Create a new pull request in a GitHub repository using VS Code's GitHub integration. */
export interface CreateGitHubPullRequestProps {
  "repository": string;
  "title": string;
  "body"?: string;
  "base"?: string;
  "head"?: string;
}

export interface CreateGitHubPullRequestResponse {
  "prUrl": null;
}

/** Open a GitHub repository in the browser using VS Code's GitHub integration. */
export interface OpenGitHubRepositoryProps {
  "repository": string;
}

export interface OpenGitHubRepositoryResponse {
  "repoUrl": string;
}

export type ToolId = "generateCode" | "generateData" | "generateImages" | "generateText" | "refactorCode" | "testCode" | "writeDocumentation" | "activeFile" | "openVirtual" | "proposeEdits" | "editorSelection" | "findFiles" | "readDir" | "readFile" | "writeFile" | "showStatusBar" | "dismissStatus" | "showStatusWindow" | "showInfoMessage" | "showInputBox" | "showWarningMessage" | "commitChanges" | "pullChanges" | "pushChanges" | "getVcsStatus" | "createWorkspaceFile" | "deleteWorkspaceFile" | "listWorkspaceFiles" | "listWorkspaceFolders" | "renameWorkspaceFolder" | "createGitBranch" | "deleteGitBranch" | "mergeGitBranch" | "closeTerminal" | "createTerminal" | "listTerminals" | "sendTextToTerminal" | "showTerminal" | "createGitHubIssue" | "createGitHubPullRequest" | "openGitHubRepository";

export type CommandMap = {
  "generateCode": { props: GenerateCodeProps; response: GenerateCodeResponse; path: "src/tools/ai/generate-code.mcpx.ts" };
  "generateData": { props: GenerateDataProps; response: GenerateDataResponse; path: "src/tools/ai/generate-data.mcpx.ts" };
  "generateImages": { props: GenerateImagesProps; response: GenerateImagesResponse; path: "src/tools/ai/generate-images.mcpx.ts" };
  "generateText": { props: GenerateTextProps; response: GenerateTextResponse; path: "src/tools/ai/generate-text.mcpx.ts" };
  "refactorCode": { props: RefactorCodeProps; response: RefactorCodeResponse; path: "src/tools/ai/refactor-code.mcpx.ts" };
  "testCode": { props: TestCodeProps; response: TestCodeResponse; path: "src/tools/ai/test-code.mcpx.ts" };
  "writeDocumentation": { props: WriteDocumentationProps; response: WriteDocumentationResponse; path: "src/tools/ai/write-documentation.mcpx.ts" };
  "activeFile": { props: ActiveFileProps; response: ActiveFileResponse; path: "src/tools/editor/active-file.mcpx.ts" };
  "openVirtual": { props: OpenVirtualProps; response: OpenVirtualResponse; path: "src/tools/editor/open-virtual.mcpx.ts" };
  "proposeEdits": { props: ProposeEditsProps; response: ProposeEditsResponse; path: "src/tools/editor/propose-edits.mcpx.ts" };
  "editorSelection": { props: EditorSelectionProps; response: EditorSelectionResponse; path: "src/tools/editor/selection.mcpx.ts" };
  "findFiles": { props: FindFilesProps; response: FindFilesResponse; path: "src/tools/fs/find.mcpx.ts" };
  "readDir": { props: ReadDirProps; response: ReadDirResponse; path: "src/tools/fs/read-dir.mcpx.ts" };
  "readFile": { props: ReadFileProps; response: ReadFileResponse; path: "src/tools/fs/read-file.mcpx.ts" };
  "writeFile": { props: WriteFileProps; response: WriteFileResponse; path: "src/tools/fs/write-file.mcpx.ts" };
  "showStatusBar": { props: ShowStatusBarProps; response: ShowStatusBarResponse; path: "src/tools/status/bar.mcpx.ts" };
  "dismissStatus": { props: DismissStatusProps; response: DismissStatusResponse; path: "src/tools/status/dismiss.mcpx.ts" };
  "showStatusWindow": { props: ShowStatusWindowProps; response: ShowStatusWindowResponse; path: "src/tools/status/window.mcpx.ts" };
  "showInfoMessage": { props: ShowInfoMessageProps; response: ShowInfoMessageResponse; path: "src/tools/ui/info.mcpx.ts" };
  "showInputBox": { props: ShowInputBoxProps; response: ShowInputBoxResponse; path: "src/tools/ui/input.mcpx.ts" };
  "showWarningMessage": { props: ShowWarningMessageProps; response: ShowWarningMessageResponse; path: "src/tools/ui/warn.mcpx.ts" };
  "commitChanges": { props: CommitChangesProps; response: CommitChangesResponse; path: "src/tools/vcs/commit.mcpx.ts" };
  "pullChanges": { props: PullChangesProps; response: PullChangesResponse; path: "src/tools/vcs/pull.mcpx.ts" };
  "pushChanges": { props: PushChangesProps; response: PushChangesResponse; path: "src/tools/vcs/push.mcpx.ts" };
  "getVcsStatus": { props: GetVcsStatusProps; response: GetVcsStatusResponse; path: "src/tools/vcs/status.mcpx.ts" };
  "createWorkspaceFile": { props: CreateWorkspaceFileProps; response: CreateWorkspaceFileResponse; path: "src/tools/workspace/create-file.mcpx.ts" };
  "deleteWorkspaceFile": { props: DeleteWorkspaceFileProps; response: DeleteWorkspaceFileResponse; path: "src/tools/workspace/delete-file.mcpx.ts" };
  "listWorkspaceFiles": { props: ListWorkspaceFilesProps; response: ListWorkspaceFilesResponse; path: "src/tools/workspace/list-files.mcpx.ts" };
  "listWorkspaceFolders": { props: ListWorkspaceFoldersProps; response: ListWorkspaceFoldersResponse; path: "src/tools/workspace/list-folders.mcpx.ts" };
  "renameWorkspaceFolder": { props: RenameWorkspaceFolderProps; response: RenameWorkspaceFolderResponse; path: "src/tools/workspace/rename-folder.mcpx.ts" };
  "createGitBranch": { props: CreateGitBranchProps; response: CreateGitBranchResponse; path: "src/tools/git/create-branch.mcpx.ts" };
  "deleteGitBranch": { props: DeleteGitBranchProps; response: DeleteGitBranchResponse; path: "src/tools/git/delete-branch.mcpx.ts" };
  "mergeGitBranch": { props: MergeGitBranchProps; response: MergeGitBranchResponse; path: "src/tools/git/merge-branch.mcpx.ts" };
  "closeTerminal": { props: CloseTerminalProps; response: CloseTerminalResponse; path: "src/tools/terminal/close.mcpx.ts" };
  "createTerminal": { props: CreateTerminalProps; response: CreateTerminalResponse; path: "src/tools/terminal/create.mcpx.ts" };
  "listTerminals": { props: ListTerminalsProps; response: ListTerminalsResponse; path: "src/tools/terminal/list.mcpx.ts" };
  "sendTextToTerminal": { props: SendTextToTerminalProps; response: SendTextToTerminalResponse; path: "src/tools/terminal/send.mcpx.ts" };
  "showTerminal": { props: ShowTerminalProps; response: ShowTerminalResponse; path: "src/tools/terminal/show.mcpx.ts" };
  "createGitHubIssue": { props: CreateGitHubIssueProps; response: CreateGitHubIssueResponse; path: "src/tools/github/create-issue.mcpx.ts" };
  "createGitHubPullRequest": { props: CreateGitHubPullRequestProps; response: CreateGitHubPullRequestResponse; path: "src/tools/github/create-pr.mcpx.ts" };
  "openGitHubRepository": { props: OpenGitHubRepositoryProps; response: OpenGitHubRepositoryResponse; path: "src/tools/github/open-repo.mcpx.ts" };
};

type GenerateCodePropsKey = "generateCodeProps";
type GenerateCodeResponseKey = "generateCodeResponse";
type GenerateDataPropsKey = "generateDataProps";
type GenerateDataResponseKey = "generateDataResponse";
type GenerateImagesPropsKey = "generateImagesProps";
type GenerateImagesResponseKey = "generateImagesResponse";
type GenerateTextPropsKey = "generateTextProps";
type GenerateTextResponseKey = "generateTextResponse";
type RefactorCodePropsKey = "refactorCodeProps";
type RefactorCodeResponseKey = "refactorCodeResponse";
type TestCodePropsKey = "testCodeProps";
type TestCodeResponseKey = "testCodeResponse";
type WriteDocumentationPropsKey = "writeDocumentationProps";
type WriteDocumentationResponseKey = "writeDocumentationResponse";
type ActiveFilePropsKey = "activeFileProps";
type ActiveFileResponseKey = "activeFileResponse";
type OpenVirtualPropsKey = "openVirtualProps";
type OpenVirtualResponseKey = "openVirtualResponse";
type ProposeEditsPropsKey = "proposeEditsProps";
type ProposeEditsResponseKey = "proposeEditsResponse";
type EditorSelectionPropsKey = "editorSelectionProps";
type EditorSelectionResponseKey = "editorSelectionResponse";
type FindFilesPropsKey = "findFilesProps";
type FindFilesResponseKey = "findFilesResponse";
type ReadDirPropsKey = "readDirProps";
type ReadDirResponseKey = "readDirResponse";
type ReadFilePropsKey = "readFileProps";
type ReadFileResponseKey = "readFileResponse";
type WriteFilePropsKey = "writeFileProps";
type WriteFileResponseKey = "writeFileResponse";
type ShowStatusBarPropsKey = "showStatusBarProps";
type ShowStatusBarResponseKey = "showStatusBarResponse";
type DismissStatusPropsKey = "dismissStatusProps";
type DismissStatusResponseKey = "dismissStatusResponse";
type ShowStatusWindowPropsKey = "showStatusWindowProps";
type ShowStatusWindowResponseKey = "showStatusWindowResponse";
type ShowInfoMessagePropsKey = "showInfoMessageProps";
type ShowInfoMessageResponseKey = "showInfoMessageResponse";
type ShowInputBoxPropsKey = "showInputBoxProps";
type ShowInputBoxResponseKey = "showInputBoxResponse";
type ShowWarningMessagePropsKey = "showWarningMessageProps";
type ShowWarningMessageResponseKey = "showWarningMessageResponse";
type CommitChangesPropsKey = "commitChangesProps";
type CommitChangesResponseKey = "commitChangesResponse";
type PullChangesPropsKey = "pullChangesProps";
type PullChangesResponseKey = "pullChangesResponse";
type PushChangesPropsKey = "pushChangesProps";
type PushChangesResponseKey = "pushChangesResponse";
type GetVcsStatusPropsKey = "getVcsStatusProps";
type GetVcsStatusResponseKey = "getVcsStatusResponse";
type CreateWorkspaceFilePropsKey = "createWorkspaceFileProps";
type CreateWorkspaceFileResponseKey = "createWorkspaceFileResponse";
type DeleteWorkspaceFilePropsKey = "deleteWorkspaceFileProps";
type DeleteWorkspaceFileResponseKey = "deleteWorkspaceFileResponse";
type ListWorkspaceFilesPropsKey = "listWorkspaceFilesProps";
type ListWorkspaceFilesResponseKey = "listWorkspaceFilesResponse";
type ListWorkspaceFoldersPropsKey = "listWorkspaceFoldersProps";
type ListWorkspaceFoldersResponseKey = "listWorkspaceFoldersResponse";
type RenameWorkspaceFolderPropsKey = "renameWorkspaceFolderProps";
type RenameWorkspaceFolderResponseKey = "renameWorkspaceFolderResponse";
type CreateGitBranchPropsKey = "createGitBranchProps";
type CreateGitBranchResponseKey = "createGitBranchResponse";
type DeleteGitBranchPropsKey = "deleteGitBranchProps";
type DeleteGitBranchResponseKey = "deleteGitBranchResponse";
type MergeGitBranchPropsKey = "mergeGitBranchProps";
type MergeGitBranchResponseKey = "mergeGitBranchResponse";
type CloseTerminalPropsKey = "closeTerminalProps";
type CloseTerminalResponseKey = "closeTerminalResponse";
type CreateTerminalPropsKey = "createTerminalProps";
type CreateTerminalResponseKey = "createTerminalResponse";
type ListTerminalsPropsKey = "listTerminalsProps";
type ListTerminalsResponseKey = "listTerminalsResponse";
type SendTextToTerminalPropsKey = "sendTextToTerminalProps";
type SendTextToTerminalResponseKey = "sendTextToTerminalResponse";
type ShowTerminalPropsKey = "showTerminalProps";
type ShowTerminalResponseKey = "showTerminalResponse";
type CreateGitHubIssuePropsKey = "createGitHubIssueProps";
type CreateGitHubIssueResponseKey = "createGitHubIssueResponse";
type CreateGitHubPullRequestPropsKey = "createGitHubPullRequestProps";
type CreateGitHubPullRequestResponseKey = "createGitHubPullRequestResponse";
type OpenGitHubRepositoryPropsKey = "openGitHubRepositoryProps";
type OpenGitHubRepositoryResponseKey = "openGitHubRepositoryResponse";

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
    "path": "src/tools/ai/generate-code.mcpx.ts",
    "name": "Generate Code",
    "description": "Generate new code from a natural language prompt, specifying language and style."
  },
  {
    "id": "generateData",
    "path": "src/tools/ai/generate-data.mcpx.ts",
    "name": "Generate Structured Data",
    "description": "Generate structured data (e.g., JSON) from a prompt and optional schema."
  },
  {
    "id": "generateImages",
    "path": "src/tools/ai/generate-images.mcpx.ts",
    "name": "Generate Images",
    "description": "Generate images from a prompt using an AI model and optional parameters."
  },
  {
    "id": "generateText",
    "path": "src/tools/ai/generate-text.mcpx.ts",
    "name": "Generate Text",
    "description": "Generate plain text from a prompt."
  },
  {
    "id": "refactorCode",
    "path": "src/tools/ai/refactor-code.mcpx.ts",
    "name": "Refactor Code",
    "description": "Refactor existing code based on instructions, language, and style."
  },
  {
    "id": "testCode",
    "path": "src/tools/ai/test-code.mcpx.ts",
    "name": "Generate Tests",
    "description": "Generate unit tests for code using the specified framework and language."
  },
  {
    "id": "writeDocumentation",
    "path": "src/tools/ai/write-documentation.mcpx.ts",
    "name": "Write Documentation",
    "description": "Write or update documentation for code in the specified format and audience."
  },
  {
    "id": "activeFile",
    "path": "src/tools/editor/active-file.mcpx.ts",
    "name": "Active File",
    "description": "Get the active editor file's path, languageId, and selected or full text."
  },
  {
    "id": "openVirtual",
    "path": "src/tools/editor/open-virtual.mcpx.ts",
    "name": "Open Virtual Document",
    "description": "Open a read-only virtual document with content and language."
  },
  {
    "id": "proposeEdits",
    "path": "src/tools/editor/propose-edits.mcpx.ts",
    "name": "Propose Edits",
    "description": "Show a diff and ask the user to apply changes to a file in the workspace."
  },
  {
    "id": "editorSelection",
    "path": "src/tools/editor/selection.mcpx.ts",
    "name": "Editor Selection",
    "description": "Get selection offsets and text for the active editor."
  },
  {
    "id": "findFiles",
    "path": "src/tools/fs/find.mcpx.ts",
    "name": "Find Files",
    "description": "Find files by glob pattern (workspace relative)."
  },
  {
    "id": "readDir",
    "path": "src/tools/fs/read-dir.mcpx.ts",
    "name": "Read Directory",
    "description": "List directory entries (name + kind)."
  },
  {
    "id": "readFile",
    "path": "src/tools/fs/read-file.mcpx.ts",
    "name": "Read File",
    "description": "Read a UTF-8 file inside the workspace."
  },
  {
    "id": "writeFile",
    "path": "src/tools/fs/write-file.mcpx.ts",
    "name": "Write File",
    "description": "Write a UTF-8 file inside the workspace (with confirm)."
  },
  {
    "id": "showStatusBar",
    "path": "src/tools/status/bar.mcpx.ts",
    "name": "Show Status Bar",
    "description": "Show a status message in the status bar. Optionally show a spinner."
  },
  {
    "id": "dismissStatus",
    "path": "src/tools/status/dismiss.mcpx.ts",
    "name": "Dismiss Status",
    "description": "Dismiss any status notification by id."
  },
  {
    "id": "showStatusWindow",
    "path": "src/tools/status/window.mcpx.ts",
    "name": "Show Status Window",
    "description": "Show a status message in a window notification."
  },
  {
    "id": "showInfoMessage",
    "path": "src/tools/ui/info.mcpx.ts",
    "name": "Show Info Message",
    "description": "Show info message with optional actions."
  },
  {
    "id": "showInputBox",
    "path": "src/tools/ui/input.mcpx.ts",
    "name": "Show Input Box",
    "description": "Prompt user for a string input."
  },
  {
    "id": "showWarningMessage",
    "path": "src/tools/ui/warn.mcpx.ts",
    "name": "Show Warning Message",
    "description": "Show warning message with optional actions."
  },
  {
    "id": "commitChanges",
    "path": "src/tools/vcs/commit.mcpx.ts",
    "name": "Commit Changes",
    "description": "Commit staged changes in the current repository with a message (supports any VCS provider)."
  },
  {
    "id": "pullChanges",
    "path": "src/tools/vcs/pull.mcpx.ts",
    "name": "Pull Changes",
    "description": "Pull changes from the remote repository (supports any VCS provider)."
  },
  {
    "id": "pushChanges",
    "path": "src/tools/vcs/push.mcpx.ts",
    "name": "Push Changes",
    "description": "Push committed changes to the remote repository (supports any VCS provider)."
  },
  {
    "id": "getVcsStatus",
    "path": "src/tools/vcs/status.mcpx.ts",
    "name": "VCS Status",
    "description": "Get the status of the current repository (supports any VCS provider)."
  },
  {
    "id": "createWorkspaceFile",
    "path": "src/tools/workspace/create-file.mcpx.ts",
    "name": "Create Workspace File",
    "description": "Create a new file in the workspace with optional content."
  },
  {
    "id": "deleteWorkspaceFile",
    "path": "src/tools/workspace/delete-file.mcpx.ts",
    "name": "Delete Workspace File",
    "description": "Delete a file from the workspace."
  },
  {
    "id": "listWorkspaceFiles",
    "path": "src/tools/workspace/list-files.mcpx.ts",
    "name": "List Workspace Files",
    "description": "List files in the workspace matching a glob pattern."
  },
  {
    "id": "listWorkspaceFolders",
    "path": "src/tools/workspace/list-folders.mcpx.ts",
    "name": "List Workspace Folders",
    "description": "List all workspace folders."
  },
  {
    "id": "renameWorkspaceFolder",
    "path": "src/tools/workspace/rename-folder.mcpx.ts",
    "name": "Rename Workspace Folder",
    "description": "Rename a folder in the workspace using VS Code's file system API (preserves user security permissions)."
  },
  {
    "id": "createGitBranch",
    "path": "src/tools/git/create-branch.mcpx.ts",
    "name": "Create Git Branch",
    "description": "Create a new branch in the current repository using VS Code's Git extension."
  },
  {
    "id": "deleteGitBranch",
    "path": "src/tools/git/delete-branch.mcpx.ts",
    "name": "Delete Git Branch",
    "description": "Delete the specified branch in the current repository using VS Code's Git extension."
  },
  {
    "id": "mergeGitBranch",
    "path": "src/tools/git/merge-branch.mcpx.ts",
    "name": "Merge Git Branch",
    "description": "Merge the specified branch into the current branch using VS Code's Git extension."
  },
  {
    "id": "closeTerminal",
    "path": "src/tools/terminal/close.mcpx.ts",
    "name": "Close Terminal",
    "description": "Close a specific integrated terminal in VS Code."
  },
  {
    "id": "createTerminal",
    "path": "src/tools/terminal/create.mcpx.ts",
    "name": "Create Terminal",
    "description": "Create a new integrated terminal in VS Code."
  },
  {
    "id": "listTerminals",
    "path": "src/tools/terminal/list.mcpx.ts",
    "name": "List Terminals",
    "description": "List all open integrated terminals in VS Code."
  },
  {
    "id": "sendTextToTerminal",
    "path": "src/tools/terminal/send.mcpx.ts",
    "name": "Send Text to Terminal",
    "description": "Send text or command to a specific integrated terminal."
  },
  {
    "id": "showTerminal",
    "path": "src/tools/terminal/show.mcpx.ts",
    "name": "Show Terminal",
    "description": "Show a specific integrated terminal in VS Code."
  },
  {
    "id": "createGitHubIssue",
    "path": "src/tools/github/create-issue.mcpx.ts",
    "name": "Create GitHub Issue",
    "description": "Create a new issue in a GitHub repository using VS Code's GitHub integration."
  },
  {
    "id": "createGitHubPullRequest",
    "path": "src/tools/github/create-pr.mcpx.ts",
    "name": "Create GitHub Pull Request",
    "description": "Create a new pull request in a GitHub repository using VS Code's GitHub integration."
  },
  {
    "id": "openGitHubRepository",
    "path": "src/tools/github/open-repo.mcpx.ts",
    "name": "Open GitHub Repository",
    "description": "Open a GitHub repository in the browser using VS Code's GitHub integration."
  }
] as const;
