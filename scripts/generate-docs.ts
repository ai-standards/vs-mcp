import path from "path";
import fs from "fs";
import { compileMCPX } from "../vendor/mcpx/compiler";

export async function generateMarkdownDocs(index: any, outDir: string) {
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
      md += `**Path:** ${tool.path}\n\n`;
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
  fs.writeFileSync(path.join(outDir, "README.md"), readme);
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
