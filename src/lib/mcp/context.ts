import { getMcpApi } from "./servers";
import * as vscode from "vscode";

import * as path from "path";
import * as fs from "fs/promises";
import * as fssync from "fs";
import { McpTool } from "./types";

/** Selectable IDE targets */
export type IdeTarget =
	| "GitHub Copilot"
	| "Cursor"
	| "Continue.dev"
	| "JetBrains AI Assistant"
	| "Other";

/** Provide content for each IDE (built from MCP API + example). */
export interface IdePayloads {
	copilot?: string;        // contents of .github/copilot-instructions.md
	cursorRules?: string;    // contents of .cursor/rules/<slug>.mdc
	cursorAgents?: string;   // optional AGENTS.md contents
	continueYaml?: string;   // contents of .continue/config.yaml
	jetbrainsRules?: string; // contents of .idea/ai/rules/<slug>.md
	otherMd?: string;        // contents of PROJECT_CONTEXT.md (root)
}

/** Provide a complete code example to embed in generated docs. */
export async function getExample(): Promise<string> {
	// You said you have this; return your snippet here.
	// Fallback placeholder so the file still compiles if empty.
	return `\nexport const metadata = {\n  id: 'hello',\n  name: 'Hello World',\n  description: 'Greets the current user'\n}\n\nexport const run = async({ mcp, scope }) => {\n  mcp.call('status.bar', {\n    message: 'Creating greeting',\n    id: 'create',\n    spinner: true\n  })\n  \n  try {\n    const message = await mcp.call('ai.generateText', {\n      prompt: 'Create a short, friendly greeting for this vs-mcp extension user'\n    })\n\n    mcp.call('status.dismiss', {\n      id: 'create'\n    })\n\n    await mcp.call("ui.info", {\n      message: message.text\n    });\n\n  } catch (err) {\n    // Best-effort friendly error surface\n    const msg = err && typeof err === "object" && "message" in err ? err.message : String(err);\n    try {\n      await mcp.call("ui.error", { message: "An error occurred" });\n    } catch {\n      // swallow to avoid unhandled rejections in extension host\n      // (ui.error might not be available if the MCP server failed to init)\n    }\n  }\n}\n  `;
}

/** Slug helper for filenames */
export function toSlug(input: string) {
	return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Ensure dir exists */
export async function ensureDir(dir: string) {
	await fs.mkdir(dir, { recursive: true });
}

/** Write file with optional overwrite prompt */
export async function writeFileWithConfirm(
	filePath: string,
	content: string,
	confirmIfExists: boolean = true,
	showWarning?: (msg: string) => Promise<string | undefined>
): Promise<boolean> {
	const exists = fssync.existsSync(filePath);
	if (exists && confirmIfExists && showWarning) {
		const choice = await showWarning(
			`File exists:\n${filePath}\nOverwrite?`
		);
		if (choice !== "Overwrite") return false;
	}
	await fs.writeFile(filePath, content, "utf8");
	return true;
}

export function renderToolsMarkdown(tools: McpTool[]): string {
	if (!tools?.length) return "_No MCP tools found._\n";
	return tools
		.map((t) => {
			const schema = t.schema ? JSON.stringify(t.schema, null, 2) : "{}";
			const resp = t.response ? JSON.stringify(t.response, null, 2) : "{}";
			return `### \`${t.name}\`\n${t.description ? `${t.description}\n` : ""}\n\n**Input schema**\n\`\`\`json\n${schema}\n\`\`\`\n\n**Response**\n\`\`\`json\n${resp}\n\`\`\`\n`;
		})
		.join("\n");
}

export function renderToolsPlainText(tools: McpTool[]): string {
	if (!tools?.length) return "No MCP tools found.";
	return tools
		.map((t) => {
			const schema = t.schema ? JSON.stringify(t.schema) : "{}";
			const resp = t.response ? JSON.stringify(t.response) : "{}";
			return `- ${t.name}${t.description ? ` — ${t.description}` : ""}\n  input: ${schema}\n  response: ${resp}`;
		})
		.join("\n\n");
}

export function indent(text: string, spaces: number): string {
	const pad = " ".repeat(spaces);
	return text
		.split("\n")
		.map((l) => (l.length ? pad + l : l))
		.join("\n");
}

/**
 * Write the appropriate context file(s) for the selected IDE(s).
 * Returns an object with created, skipped, and missing arrays.
 */

export async function getContext(target?: IdeTarget): Promise<string> {
	const toolsApi = await getMcpApi();
	const tools: McpTool[] = toolsApi.map(t => ({
		name: t.name,
		description: t.description,
		schema: t.schema,
		response: t.response,
		call: () => { throw new Error("Not implemented"); }
	}));
	const example = await getExample();
	const toolsMd = renderToolsMarkdown(tools);
	const exampleMd = example ? `\n## Complete Example\n\n\`\`\`ts\n${example}\n\`\`\`\n` : "";

	const agentMd = [
		'This repository uses **VS-MCP tools**. Any file that ends in \'agent.js\' is a VS-MCP agent.',
		'',
		'When you create or update a VS-MVC agent you must use these tools exclusively if at all possible.',
		'',
		'Here are a few key points about writing these agents:',
		'',
		'- the functions are injected with {mcp, scope}. mcp is our mcp server and scope is the path the person clicked to run this',
		'- always communicate with the users using the status and ui mcps',
		'- always confirm before writing or editing a file',
		'- include detailed comments explaining what you are doing and why'
	].join('\n');

	// Copilot — repo-wide markdown
	const copilot = [
		'# Project AI Context',
		'',
		agentMd,
		'',
		'## MCP Tools',
		toolsMd,
		exampleMd
	].join('\n');

	// Cursor rules — .mdc with front-matter
	const cursorRules = [
		'---',
		'description: MCP project rules and tool reference',
		'globs:',
		'  - "**/*"',
		'alwaysApply: false',
		'---',
		'',
		'# MCP Rules & Reference',
		'',
		agentMd,
		'',
		'- Prefer generating code that *uses* these tools over introducing new, redundant helpers.',
		'- Keep diffs minimal and align with existing patterns.',
		'',
		'## MCP Tools',
		toolsMd,
		exampleMd
	].join('\n');

	// Optional Cursor AGENTS.md
	const cursorAgents = [
		'# Agents',
		'',
		agentMd,
		'',
		'- **CodeGen**: Generates strongly-typed code aligned with MCP tools.',
		'- **DocBot**: Improves inline docs and READMEs using tool references.',
		'',
		'> Keep responses concise; include rationale only when it changes a decision.',
		''
	].join('\n');

	// Continue.dev — workspace config with rules text
	const continueBody = [
		'Project MCP tools and usage guidance.',
		'',
		agentMd,
		'',
		'MCP Tools:',
		indent(renderToolsPlainText(tools), 2),
		'',
		example ? 'Example:\n' + indent(example, 2) : ''
	].join('\n').trim();
	const continueYaml = [
		'# .continue/config.yaml',
		'models:',
		'  - provider: "openai"',
		'    name: "gpt-4o-mini"',
		'',
		'context:',
		'  rules:',
		'    - name: "MCP Tools"',
		'      text: |',
		indent(continueBody, 8),
		''
	].join('\n');

	// JetBrains rules (markdown under .idea/ai/rules)
	const jetbrainsRules = [
		'# Project Rules – MCP',
		'',
		agentMd,
		'',
		'Use the MCP tools below when generating or refactoring code. Prefer minimal diffs and align to existing patterns.',
		'',
		'## MCP Tools',
		toolsMd,
		exampleMd
	].join('\n');

	// Other — simple root file
	const otherMd = [
		'# Project Context',
		'',
		agentMd,
		'',
		'This repository includes an MCP tool surface. Use these tools when generating code.',
		'',
		'## MCP Tools',
		toolsMd,
		exampleMd
	].join('\n');

	switch (target) {
		case "GitHub Copilot":
			return copilot;
		case "Cursor":
			return cursorRules;
		case "Continue.dev":
			return continueYaml;
		case "JetBrains AI Assistant":
			return jetbrainsRules;
		case "Other":
			return otherMd;
		default:
			return otherMd;
	}
}
