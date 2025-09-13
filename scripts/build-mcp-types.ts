// Script to statically generate MCP tool types from server definitions
import { getMcpApi } from "../src/tools/servers/index";
import * as fs from "fs";
import * as path from "path";

function tsType(schemaType: string): string {
  // Basic mapping from schema string to TS type
  if (schemaType.startsWith("string")) return "string";
  if (schemaType.startsWith("number")) return "number";
  if (schemaType.startsWith("boolean")) return "boolean";
  if (schemaType.startsWith("any")) return "any";
  if (schemaType.endsWith("[]")) return "any[]";
  return "any";
}

function buildTypes(tools: any[]) {
  let toolNames = tools.map(t => `  | \"${t.name}\"`).join("\n");
  let payloads = tools.map(t => {
    const fields = t.schema
      ? Object.entries(t.schema)
          .map(([k, v]) => {
            const vStr = v as string;
            return `    ${k.replace(/\?.*/,"")}${vStr.includes("?") ? "?" : ""}: ${tsType(vStr)};`;
          })
          .join("\n")
      : "";
    return `  \"${t.name}\": {\n${fields}\n  };`;
  }).join("\n");
  let responses = tools.map(t => {
    const fields = t.response
      ? Object.entries(t.response)
          .map(([k, v]) => {
            const vStr = v as string;
            return `    ${k.replace(/\?.*/,"")}${vStr.includes("?") ? "?" : ""}: ${tsType(vStr)};`;
          })
          .join("\n")
      : "";
    return `  \"${t.name}\": {\n${fields}\n  };`;
  }).join("\n");
  return `// Auto-generated MCP tool types\n\nexport type McpToolName =\n${toolNames};\n\nexport interface McpToolPayloads {\n${payloads}\n}\n\nexport interface McpToolResponses {\n${responses}\n}\n`;
}

async function main() {
  const tools = await getMcpApi();
  const types = buildTypes(tools);
  const outPath = path.resolve(__dirname, "../src/webview/types/mcpTools.ts");
  fs.writeFileSync(outPath, types);
  console.log("MCP tool types generated at", outPath);
}

main();
