import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import ora from "ora";
import {mcpToolIndex} from '../src/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const docContext = `We want the documentation to feel like a well written coding book, conversational, engaging but 0 tolerance for fluff.

Format the document as **semantic Markdown**, following these rules:

  - Use appropriate headings:
    - # for the main document title
    - ## for major sections
    - ### for subsections
  - Use bullet points (-) for unordered lists.
  - Use numbers (1.) for ordered lists when order matters.
  - Use **bold** for emphasis on key terms, and *italics* for lighter emphasis.
  - Convert inline URLs into Markdown links: [title](url).
  - Use fenced code blocks (\`\`\`language … \`\`\`) for code or structured text.
  - Keep paragraphs concise (one idea per paragraph).
  - Do not include extra decoration or styling beyond semantic Markdown.
`

async function main() {
  const index = {...mcpToolIndex};
  const docPath = path.join(process.cwd(), 'docs');

  const apiSpinner = ora('Generating API docs...').start();
  try {
    await generateApiDocs(index, docPath);
    apiSpinner.succeed('API docs generated.');
  } catch (err) {
    apiSpinner.fail('Failed to generate API docs.');
    throw err;
  }

  // const readmeSpinner = ora('Generating README...').start();
  // try {
  //   await generateReadme(index, docPath);
  //   readmeSpinner.succeed('README generated.');
  // } catch (err) {
  //   readmeSpinner.fail('Failed to generate README.');
  //   throw err;
  // }

  for (const tool of index.tools.slice(1)) {
    const readmeSpinner = ora('Generating tool docs: ' + tool.id + '...').start();
    try {
      await generateTool(tool, docPath);
      readmeSpinner.succeed('Tool docs generated.');
    } catch (err) {
      readmeSpinner.fail('Failed to generate tool docs.');
      throw err;
    }
  }
}

main().then(_ => console.log('Completed generating docs'));

export async function generateApiDocs(index: any, outDir: string) {
  // Prepare index for README.md at the end
  // (removed duplicate declaration, only declare 'readme' at the end)
  // Write each namespace's docs to docs/{namespace}/api.md
  // Group tools by namespace
  const byNamespace: Record<string, any[]> = {};
  for (const tool of index.tools) {
    const ns = tool.namespace || "default";
    if (!byNamespace[ns]) byNamespace[ns] = [];
    byNamespace[ns].push(tool);
  }
  for (const [namespace, tools] of Object.entries(byNamespace)) {
  // Create a folder for each namespace at docs/{namespace}
  const nsDir = path.join(outDir, namespace);
  if (!fs.existsSync(nsDir)) fs.mkdirSync(nsDir, { recursive: true });
    let md = `# ${namespace}\n\n`;
    for (const tool of tools) {
      md += `## ${tool.name || tool.id}\n\n`;
      if (tool.description) md += `${tool.description}\n\n`;
      md += `* **Token:** \`${tool.namespace}.${tool.id}\`\n`;
      md += `* **Path:** ${tool.path}\n\n`;
      md += `### Input\n`;
      md += renderTable(tool.input, ["Name", "Type", "Required"]);
      md += `\n### Output\n`;
      md += renderTable(tool.output, ["Name", "Type", "Required"]);
      if (tool.example) {
        md += `\n### Example\n`;
        md += '```js\n' + JSON.stringify(tool.example, null, 2) + '\n```\n';
      }
      md += `\n`;
    }
  const filePath = path.join(nsDir, "api.md");
  fs.writeFileSync(filePath, md);
  }

  // Now generate README.md index
  let readme = `# MCPX Tool Documentation\n\n`;
  readme += `This index lists all available MCPX tool namespaces and their tools.\n\n`;
  for (const [namespace, tools] of Object.entries(byNamespace)) {
    readme += `## [${namespace}](./${namespace})\n`;
    readme += `\n`;
    readme += '| MCP | Description |\n';
    readme += '| --- | ----------- |\n';
    for (const tool of tools) {
          const key = `${namespace}.${tool.id}`;
          readme += `| \`${key}\` | ${tool.description} |\n`;
    }
    readme += `\n`;
  }
  fs.writeFileSync(path.join(outDir, "api.md"), readme);
}
function renderTable(obj: Record<string, any>, headers: string[]): string {
  if (!obj || Object.keys(obj).length === 0) return "_None_\n";
  // Filter out __self and import(...) keys
  const filtered = Object.entries(obj).filter(([key]) => {
    if (key === "__self") return false;
    if (/^import\(.+\)/.test(key)) return false;
    return true;
  });
  if (filtered.length === 0) return "_None_\n";
  let table = `| ${headers.join(" | ")} |\n| ${headers.map(() => "---").join(" | ")} |\n`;
  for (const [key, val] of filtered) {
    table += `| ${key} | ${val.type || ""} | ${val.required ? "Yes" : "No"} |\n`;
  }
  return table;
}

async function generateReadme(index: any, docPath: string) {
  const prompt = `Generate the documentation home page for the vs-mcp extension

  ${docContext}

  Start with a headline and paragraph or two about the extension. Here's a bit of information about the extension:

  "VS-MCP grew out of a simple need: trying out ideas in VS Code without the overhead of a full extension build. 
  With it, a single JavaScript function can run as an extension at runtime. That makes it straightforward to 
  test commands, explore APIs, or wire up quick tools directly in the editor.
  Under the hood, VS-MCP runs on a lightweight MCP server that we inject into your functions. This gives you 
  direct access to the editor’s APIs without extra boilerplate — you focus on the logic, and the server handles 
  the integration. Because extensions run at runtime, iteration is fast: update your function, reload, and you’re 
  live. Whether you’re prototyping a new command, wiring AI into your workflow, or building a tool to share across 
  your team, VS-MCP provides the shortest path from idea to working extension."

  Then put a code example to show people how it works:

\`\`\`javascript 
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
      prompt: \`Write a blog post about \${value}.\`,
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
\`\`\`

  Next explain each namespace. It should have an ## title, then a paragraph or two about what it is, the capabilities, etc.
  
  Then a markdown table with the mcps in that namespace. For example: 

  | MCP | Description |
  | --- | ----------- |
  | \`agent.createAgent\` | Generate a new MCP agent |
  | \`agent.listAgents\` | List all MCP agents in the project |
  | \`agent.runAgent\` | Generate a new MCP agent |

  Each namespace should link to its folder in docs, like ai -> /docs/ai.

  Here is our complete API in JSON format:

  \`\`\`json\n${JSON.stringify(index)}\n\`\`\`
  `;

  // Call OpenAI GPT-5 to generate the README.md content
  const completion = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      { role: "system", content: "You are a helpful technical documentation assistant." },
      { role: "user", content: prompt }
    ],
    max_completion_tokens: 5000
  });

  const content = completion.choices?.[0]?.message?.content || "";
  const readmePath = path.join(docPath, "README.md");
  fs.writeFileSync(readmePath, content);
}

async function generateTool(tool: any, docPath: string) {
  const prompt = `Generate the documentation page for this mcp tool in the vs-mcp extension

  ${docContext}

  Start with a headline and paragraph or two about the tool. Explain what it does, why you might need it, ways to use it. 

  Next show examples. 
  
  - all examples should be in javascript
  - you have an instance of mcp, the mcp server, and scope, which is the filepath (optional) in all of your examples
  - call all mcps with the mcp.dispatch(...) function
  - use minimal vanilla JS, always use the mcps if possible in your examples 

  Start with basic usage (obviously replace with basic usage of this tool):

  const { value } = await mcp.dispatch('ui.showInputBox', {
    prompt: 'What topic do you want to write about?'
  });

  If there are a number of different things you can do with this tool then show the variations as sections with 
  a paragraph explaining and a code example.
  
  We want the documentation to feel like a well written coding book, conversational, engaging but 0 tolerance for 
  fluff.

  Here is the tool details in JSON format:

  \`\`\`json\n${JSON.stringify(tool)}\n\`\`\`

  This is a list of the available tools for your reference: 
  \`\`\`json\n${JSON.stringify(mcpToolIndex)}\n\`\`\`
  `;

  // Call OpenAI to generate the README.md content
  const completion = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      { role: "system", content: "You are a helpful technical documentation assistant." },
      { role: "user", content: prompt }
    ],
    max_completion_tokens: 5000
  });

  const content = completion.choices?.[0]?.message?.content || "";
  const toolPath = path.join(docPath, tool.namespace);
  fs.mkdirSync(toolPath, {recursive: true});
  fs.writeFileSync(path.join(toolPath, tool.id + '.md'), content);
}