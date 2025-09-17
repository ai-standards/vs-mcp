import { mcpToolIndex } from '../server/index';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import * as vscode from 'vscode';

export const CONTEXT_PROVIDERS = [
	{
		id: 'vscode',
		title: 'Visual Studio Code',
		path: '.vscode/context.json'
	},
	{
		id: 'github-copilot',
		title: 'GitHub Copilot',
		path: '.github/copilot-context.json'
	},
	{
		id: 'cursor',
		title: 'Cursor IDE',
		path: '.cursor/context.json'
	},
	{
		id: 'jetbrains',
		title: 'JetBrains IDEs',
		path: '.idea/context.json'
	},
	{
		id: 'codespaces',
		title: 'GitHub Codespaces',
		path: '.codespaces/context.json'
	},
	{
		id: 'replit',
		title: 'Replit',
		path: '.replit/context.json'
	},
    {
        id: 'aicode',
        title: 'AI Code Editor',
        path: '.aicode/context.json'
    },
    {
        id: 'continue',
        title: 'Continue.dev',
        path: '.continue/context.json'
    },
    {
        id: 'custom',
        title: 'Custom context provider',
		path: 'vsmcp-context.md'
    }
];

export function listContextProviders() {

	return CONTEXT_PROVIDERS.map(provider => ({
		...provider,
		enabled: contextExists(provider.id)
	}));
}

function contextExists(providerId: string) {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders || workspaceFolders.length === 0) {
		return false;
	}
	const projectRoot = workspaceFolders[0].uri.fsPath;
	const provider = CONTEXT_PROVIDERS.find(p => p.id === providerId);
	if (!provider) {
		return false;
	}
	const ctxPath = join(projectRoot, provider.path);
	return existsSync(ctxPath) && readFileSync(ctxPath).includes('VS_MCP')
}


export function createContextProvider(providerId: string) {
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders || workspaceFolders.length === 0) {
		throw new Error('No workspace folder found.');
	}
	const projectRoot = workspaceFolders[0].uri.fsPath;
	const provider = CONTEXT_PROVIDERS.find(p => p.id === providerId);
	if (!provider) {
		throw new Error(`Provider with id "${providerId}" not found.`);
	}
	const ctxPath = join(projectRoot, provider.path);

	if (existsSync(ctxPath)) {
		const prev = readFileSync(ctxPath, 'utf8');
		const updated = prev + '\n' + context;
		require('fs').writeFileSync(ctxPath, updated, 'utf8');
	} else {
		require('fs').writeFileSync(ctxPath, context, 'utf8');
	}
}


const context = `
# How to generate VS-MCP agents

We are developing agents for the VsCode VS-MCP extension. 

These agents are simple, async JavaScript functions which are injected with a lightweight mcp server and the editor scope.

The MCP server enables the agent to integrate with the host extension. Our MCP tools are strongly typed and accept a "context" payload, 
then return a mutated "context" response. Each tool definition describes their input and output context types. Here are all of our current 
tools in JSON format:

\`\`\`json
${JSON.stringify(mcpToolIndex.tools, null, 2)}
\`\`\`

Here's a complete example of an end to end agent that prompts the user for a topic, then writes a blog post and opens it in the editor:

\`\`\`javascript
// path/to/write-tech-blog-post.agent.js

export const metadata = {
  id: 'writeTechBlogPost',
  name: 'Write Tech Blog Post',
  description: 'Generates a tech blog post based on a given topic and structure.'
}

export const run = async ({ mcp, scope }) => {
  // Notify the user that the blog post generation is starting
  await mcp.dispatch('status.showStatusBar', {
    message: 'Generating tech blog post...',
    id: 'generateBlogPost',
    spinner: true
  });

  try {
    // Prompt the user for the topic of the blog post
    const { value: topic } = await mcp.dispatch('ui.showInputBox', {
      prompt: 'What topic do you want to write about?'
    });

    // Generate the blog post content using AI
    const blogPost = await mcp.dispatch('ai.generateText', {
      prompt: \`Write a tech blog post about \${topic}. Include an introduction, main content, and a conclusion.\`,
      maxTokens: 500
    });

    // Dismiss the status message
    await mcp.dispatch('status.dismissStatus', { id: 'generateBlogPost' });

    // Show the generated blog post to the user
    await mcp.dispatch('editor.openVirtual', { content: blogPost.text, language: 'md' });
  } catch (err) {
    // Handle any errors that occur during the process
    const msg = err && typeof err === "object" && "message" in err ? err.message : String(err);
    await mcp.dispatch('ui.showWarningMessage', { message: 'An error occurred: ' + msg });
  }
}
\`\`\`

`

// Removed duplicate customContext function