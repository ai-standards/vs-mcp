import { mcpToolIndex } from '../server/index';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import * as vscode from 'vscode';

export const CONTEXT_PROVIDERS = [
	{
		id: 'vscode',
		title: 'Visual Studio Code',
		path: '.vscode/context.md'
	},
	{
		id: 'github-copilot',
		title: 'GitHub Copilot',
		path: '.github/copilot-context.md'
	},
	{
		id: 'cursor',
		title: 'Cursor IDE',
		path: '.cursor/context.md'
	},
	{
		id: 'jetbrains',
		title: 'JetBrains IDEs',
		path: '.idea/context.md'
	},
	{
		id: 'codespaces',
		title: 'GitHub Codespaces',
		path: '.codespaces/context.md'
	},
	{
		id: 'replit',
		title: 'Replit',
		path: '.replit/context.md'
	},
    {
        id: 'aicode',
        title: 'AI Code Editor',
        path: '.aicode/context.md'
    },
    {
        id: 'continue',
        title: 'Continue.dev',
        path: '.continue/context.md'
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
	try {
		return readFileSync(ctxPath).includes('VS-MCP');
	} catch (e: any) {
		return false;
	}
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
		writeFileSync(ctxPath, updated, 'utf8');
	} else {
		mkdirSync(dirname(ctxPath), {recursive: true});
		writeFileSync(ctxPath, context, 'utf8');
	}
}

const context = `
# IMPORTANT: Conditional Usage (HARD GUARD)

⚠️ **Apply EVERYTHING below *only* when generating or editing a VS-MCP agent.**  
If this is **not** a VS-MCP agent task, **produce no code** and instead add a single comment:
\`// Ignored: Not a VS-MCP agent per project rules.\`

---

## Decision Gate — must pass **both** checks

**A. File Signal (any of these):**
- Current file name ends with: \`.agent.js\` or \`.agent.ts\`
- OR the user explicitly says: “VS-MCP”, “vsmcp”, “MCP agent”, or “VS-MCP agent”

**B. Intent Signal (any of these phrases in the request):**
- “create an agent”, “write an agent”, “update the agent”, “convert to agent”

➡️ **If A and B are not both true:**  
**Do not** generate Node/CLI scripts or generic code. Output only:
\`// Ignored: Not a VS-MCP agent per project rules.\`

---

# VS-MCP Agent Authoring Standard (STRICT)

You are generating agents for the VS-MCP extension. **Follow these rules exactly.**

## Golden Rules
1) **Exports:** ESM with exactly two named exports: \`metadata\` and \`run\`.
2) **Metadata:** Plain object with \`id\`, \`name\`, \`description\`. IDs are lowerCamelCase.
3) **Signature:** \`export const run = async ({ mcp, scope }) => { ... }\`
4) **Tool Calls:** **Only** via \`mcp.dispatch(namespace.tool, payload)\`.
   - Never import or reference host APIs directly.
   - Never wrap \`mcp.dispatch\` in custom helpers.
5) **Context I/O:** Tools accept a "context" payload and return a mutated "context" object. Pass only documented fields.
6) **Control Flow:** Single top-level \`try/catch\` inside \`run\`. Display errors with MCP UI tools.
7) **User Interaction:** Use MCP UI tools (\`ui.showInputBox\`, \`ui.showInformationMessage\`, etc.).
8) **Status UX:** Show a status bar entry for long tasks; dismiss on success **and** in \`catch\`.
9) **No Side Channels:** No \`console.log\`, \`process.*\`, timers, env access, or external deps. All I/O via MCP.
10) **Deterministic Output:** Create/edit files only with MCP tools (e.g., \`editor.openVirtual\`, \`workspace.writeFile\`).
11) **No Globals:** Don’t mutate globals. Everything lives inside \`run\`.
12) **Comments:** Short and task-oriented. No decorative comments.

## Forbidden APIs (NEVER use in agents)
- \`require()\`, \`import('openai')\`, direct OpenAI SDK usage
- \`readline\`, Node fs/net/process/timers
- VS Code API imports
- Any network or filesystem access outside \`mcp.dispatch\`

## Available MCP Tools (authoritative JSON)
Use exactly as defined below.

\`\`\`json
${JSON.stringify(mcpToolIndex.tools, null, 2)}
\`\`\`

## Required Error Pattern
- Derive a safe string from unknown errors.
- Inform the user via \`ui.showWarningMessage\`.
- Always dismiss any active status item.

\`\`\`js
// Error pattern to copy:
const msg = err && typeof err === "object" && "message" in err ? err.message : String(err);
await mcp.dispatch('ui.showWarningMessage', { message: 'An error occurred: ' + msg });
\`\`\`

## Minimal Agent Template (copy exactly when starting a new agent)

\`\`\`javascript
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
      prompt: \`Write a concise, structured tech blog post about "\${topic}". Include an intro, 2–3 sections with bullets, and a conclusion. Use semantic Markdown.\`,
      maxTokens: 800
    });

    await mcp.dispatch('editor.openVirtual', {
      content: aiResult.text,
      language: 'md',
      title: \`blog-\${topic.replace(/\\s+/g, '-').toLowerCase()}.md\`
    });

    await mcp.dispatch('status.dismissStatus', { id: 'writeTechBlogPost' });
  } catch (err) {
    const msg = err && typeof err === "object" && "message" in err ? err.message : String(err);
    await mcp.dispatch('status.dismissStatus', { id: 'writeTechBlogPost' });
    await mcp.dispatch('ui.showWarningMessage', { message: 'An error occurred: ' + msg });
  }
};
\`\`\`

## Do / Don’t

**Do**
- Use only \`mcp.dispatch\` for UI, status, AI, editor, FS, telemetry.
- Keep a single \`try/catch\`.
- Validate inputs; handle cancel paths.
- Use semantic Markdown for docs.

**Don’t**
- Don’t import Node/VS Code APIs or OpenAI SDKs.
- Don’t wrap \`mcp.dispatch\`.
- Don’t log to console or use timers.
- Don’t mutate global state or use env vars.

## Example: End-to-End Writing Agent (reference)
\`\`\`javascript
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
      prompt: \`Write a tech blog post about "\${topic}". Include an introduction, 2–3 concise sections, and a conclusion. Use headings and bullets.\`,
      maxTokens: 800
    });

    await mcp.dispatch('editor.openVirtual', {
      content: blogPost.text,
      language: 'md',
      title: \`blog-\${topic.replace(/\\s+/g, '-').toLowerCase()}.md\`
    });

    await mcp.dispatch('status.dismissStatus', { id: 'generateBlogPost' });
  } catch (err) {
    const msg = err && typeof err === "object" && "message" in err ? err.message : String(err);
    await mcp.dispatch('status.dismissStatus', { id: 'generateBlogPost' });
    await mcp.dispatch('ui.showWarningMessage', { message: 'An error occurred: ' + msg });
  }
};
\`\`\`

## Self-Checklist (must be true before finishing)
- [ ] Decision Gate passed (filename/keywords + intent).
- [ ] ESM named exports only: \`metadata\`, \`run\`.
- [ ] Only \`mcp.dispatch\` for all interactions.
- [ ] Single \`try/catch\`; required error pattern used.
- [ ] Status shown/dismissed around long tasks.
- [ ] No console/timers/Node/VS Code/OpenAI SDK imports.
- [ ] Inputs validated; cancel path handled.
- [ ] Output via MCP editor tools.

---
**If this is not a VS-MCP agent request or file, output only:**  
\`// Ignored: Not a VS-MCP agent per project rules.\`
`
