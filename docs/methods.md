# MCP Tool Methods & Categories

This document lists all available MCP tool methods, organized by category.


## AI

### generateText
**Input:**
```ts
{
	prompt: string;

	# MCP Tool Methods & Categories

	## AI

	### generateText
	**Input:**
	```ts
	{
		prompt: string;
		maxTokens?: number;
		model?: string;
		temperature?: number;
	}
	```
	**Output:**
	```ts
	{
		prompt: string;
		maxTokens?: number;
		model?: string;
		temperature?: number;
		text: string;
	}
	```
	**Example:**
	```ts
	await generateText({ prompt: "Hello world!" });
	```

	### generateData
	**Input:**
	```ts
	{
		prompt: string;
		schema?: string;
		maxTokens?: number;
		model?: string;
		temperature?: number;
	}
	```
	**Output:**
	```ts
	{
		prompt: string;
		schema?: string;
		maxTokens?: number;
		model?: string;
		temperature?: number;
		data: any;
	}
	```
	**Example:**
	```ts
	await generateData({ prompt: "Generate a user object", schema: "{name:string,age:number}" });
	```

	### generateImages
	**Input:**
	```ts
	{
		prompt: string;
		count?: number;
		size?: "512x512" | "auto" | "1024x1024" | "1536x1024" | "1024x1536" | "256x256" | "1792x1024" | "1024x1792";
		model?: string;
	}
	```
	**Output:**
	```ts
	{
		prompt: string;
		count?: number;
		size?: "512x512" | "auto" | "1024x1024" | "1536x1024" | "1024x1536" | "256x256" | "1792x1024" | "1024x1792";
		model?: string;
		images: any[];
		note?: string;
	}
	```
	**Example:**
	```ts
	await generateImages({ prompt: "A cat in a spacesuit" });
	```

	### generateCode
	**Input:**
	```ts
	{
		prompt: string;
		language?: string;
		style?: string;
		maxTokens?: number;
	}
	```
	**Output:**
	```ts
	{
		prompt: string;
		language?: string;
		style?: string;
		maxTokens?: number;
		code: string;
		language: string;
	}
	```
	**Example:**
	```ts
	await generateCode({ prompt: "FizzBuzz in Python", language: "python" });
	```

	### refactorCode
	**Input:**
	```ts
	{
		code: string;
		instructions: string;
		language?: string;
		style?: string;
	}
	```
	**Output:**
	```ts
	{
		code: string;
		instructions: string;
		language?: string;
		style?: string;
		refactoredCode: string;
	}
	```
	**Example:**
	```ts
	await refactorCode({ code: "function foo(){}", instructions: "Rename to bar" });
	```

	### testCode
	**Input:**
	```ts
	{
		code: string;
		framework?: string;
		language?: string;
	}
	```
	**Output:**
	```ts
	{
		code: string;
		framework?: string;
		language?: string;
		tests: string;
	}
	```
	**Example:**
	```ts
	await testCode({ code: "function add(a,b){return a+b;}", framework: "jest" });
	```

	### writeDocumentation
	**Input:**
	```ts
	{
		code: string;
		format?: string;
		audience?: string;
	}
	```
	**Output:**
	```ts
	{
		code: string;
		format?: string;
		audience?: string;
		docs: string;
	}
	```
	**Example:**
	```ts
	await writeDocumentation({ code: "function foo(){}", format: "markdown" });
	```

	## Editor

	### openVirtual
	**Input:**
	```ts
	{
		content: string;
		language?: string;
	}
	```
	**Output:**
	```ts
	{
		content: string;
		language?: string;
		ok: boolean;
	}
	```
	**Example:**
	```ts
	await openVirtual({ content: "Hello", language: "markdown" });
	```

	### proposeEdits
	**Input:**
	```ts
	{
		targetPath: string;
		newContent: string;
		title?: string;
		workspaceRoot: string;
	}
	```
	**Output:**
	```ts
	{
		targetPath: string;
		newContent: string;
		title?: string;
		workspaceRoot: string;
		applied: boolean;
	}
	```
	**Example:**
	```ts
	await proposeEdits({ targetPath: "README.md", newContent: "New content", workspaceRoot: "/workspace" });
	```

	### activeFile
	**Output:**
	```ts
	{
		path: string;
		languageId: string;
		text: string;
	}
	```
	**Example:**
	```ts
	await activeFile();
	```

	### editorSelection
	**Output:**
	```ts
	{
		path: string;
		start: number;
		end: number;
		text: string;
	}
	```
	**Example:**
	```ts
	await editorSelection();
	```

	## FS (File System)

	### readFile
	**Input:**
	```ts
	{
		path: string;
		workspaceRoot: string;
	}
	```
	**Output:**
	```ts
	{
		path: string;
		workspaceRoot: string;
		text: string;
	}
	```
	**Example:**
	```ts
	await readFile({ path: "README.md", workspaceRoot: "/workspace" });
	```

	### writeFile
	**Input:**
	```ts
	{
		path: string;
		content: string;
		workspaceRoot: string;
	}
	```
	**Output:**
	```ts
	{
		path: string;
		content: string;
		workspaceRoot: string;
		ok: boolean;
	}
	```
	**Example:**
	```ts
	await writeFile({ path: "README.md", content: "Hello", workspaceRoot: "/workspace" });
	```

	### readDir
	**Input:**
	```ts
	{
		dir: string;
		workspaceRoot: string;
	}
	```
	**Output:**
	```ts
	{
		dir: string;
		workspaceRoot: string;
		items: { name: string; type: string }[];
	}
	```
	**Example:**
	```ts
	await readDir({ dir: ".", workspaceRoot: "/workspace" });
	```

	### findFiles
	**Input:**
	```ts
	{
		glob?: string;
		maxResults?: number;
	}
	```
	**Output:**
	```ts
	{
		files: string[];
	}
	```
	**Example:**
	```ts
	await findFiles({ glob: "src/**/*.ts" });
	```

	## Status

	### showStatusWindow
	**Input:**
	```ts
	{
		id: string;
		message: string;
	}
	```
	**Output:**
	```ts
	{
		id: string;
		message: string;
		shown: boolean;
	}
	```
	**Example:**
	```ts
	await showStatusWindow({ id: "build", message: "Build started" });
	```

	### showStatusBar
	**Input:**
	```ts
	{
		id: string;
		message: string;
		spinner?: boolean;
	}
	```
	**Output:**
	```ts
	{
		id: string;
		message: string;
		spinner?: boolean;
		shown: boolean;
		spinner: boolean;
	}
	```
	**Example:**
	```ts
	await showStatusBar({ id: "build", message: "Building...", spinner: true });
	```

	### dismissStatus
	**Input:**
	```ts
	{
		id: string;
	}
	```
	**Output:**
	```ts
	{
		id: string;
		dismissed: boolean;
	}
	```
	**Example:**
	```ts
	await dismissStatus({ id: "build" });
	```

	## UI

	### showInfoMessage
	**Input:**
	```ts
	{
		message: string;
		actions?: string[];
	}
	```
	**Output:**
	```ts
	{
		choice: string | null;
	}
	```
	**Example:**
	```ts
	await showInfoMessage({ message: "Operation complete", actions: ["OK"] });
	```

	### showWarningMessage
	**Input:**
	```ts
	{
		message: string;
		actions?: string[];
	}
	```
	**Output:**
	```ts
	{
		choice: string | null;
	}
	```
	**Example:**
	```ts
	await showWarningMessage({ message: "Are you sure?", actions: ["Yes", "No"] });
	```

	### showInputBox
	**Input:**
	```ts
	{
		prompt: string;
		placeHolder?: string;
	}
	```
	**Output:**
	```ts
	{
		value: string | null;
	}
	```
	**Example:**
	```ts
	await showInputBox({ prompt: "Enter your name" });
	```

	## GitHub

	### createGitHubIssue
	**Input:**
	```ts
	{
		repository: string;
		title: string;
		body?: string;
	}
	```
	**Output:**
	```ts
	{
		issueUrl: string | null;
	}
	```
	**Example:**
	```ts
	await createGitHubIssue({ repository: "owner/repo", title: "Bug report" });
	```

	### createGitHubPullRequest
	**Input:**
	```ts
	{
		repository: string;
		title: string;
		body?: string;
		base?: string;
		head?: string;
	}
	```
	**Output:**
	```ts
	{
		prUrl: string | null;
	}
	```
	**Example:**
	```ts
	await createGitHubPullRequest({ repository: "owner/repo", title: "Add feature" });
	```

	### openGitHubRepository
	**Input:**
	```ts
	{
		repository: string;
	}
	```
	**Output:**
	```ts
	{
		repoUrl: string;
	}
	```
	**Example:**
	```ts
	await openGitHubRepository({ repository: "owner/repo" });
	```

	## Git

	### createGitBranch
	**Input:**
	```ts
	{
		branchName: string;
	}
	```
	**Output:**
	```ts
	{
		success: boolean;
		error?: string;
	}
	```
	**Example:**
	```ts
	await createGitBranch({ branchName: "feature/new" });
	```

	### mergeGitBranch
	**Input:**
	```ts
	{
		branchName: string;
	}
	```
	**Output:**
	```ts
	{
		success: boolean;
		error?: string;
	}
	```
	**Example:**
	```ts
	await mergeGitBranch({ branchName: "feature/new" });
	```

	### deleteGitBranch
	**Input:**
	```ts
	{
		branchName: string;
	}
	```
	**Output:**
	```ts
	{
		success: boolean;
		error?: string;
	}
	```
	**Example:**
	```ts
	await deleteGitBranch({ branchName: "feature/old" });
	```

	...continue for VCS, Terminal, Workspace, etc...
- findFiles

## Status
- showStatusWindow
- showStatusBar
- dismissStatus

## UI
- showInfoMessage
- showWarningMessage
- showInputBox

## GitHub
- createGitHubIssue
- createGitHubPullRequest
- openGitHubRepository

## Git
- createGitBranch
- mergeGitBranch
- deleteGitBranch

## VCS (Version Control)
- commitChanges
- pushChanges
- pullChanges
- getVcsStatus

## Terminal
- createTerminal
- sendTextToTerminal
- listTerminals
- showTerminal
- closeTerminal

## Workspace
- listWorkspaceFiles
- createWorkspaceFile
- deleteWorkspaceFile
- listWorkspaceFolders
- renameWorkspaceFolder
