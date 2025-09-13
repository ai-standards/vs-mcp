# MCP Tool Methods & Categories

This document lists all available MCP tool methods, organized by category.


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
- openVirtual
- proposeEdits
- activeFile
- editorSelection

## FS (File System)
- readFile
- writeFile
- readDir
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
