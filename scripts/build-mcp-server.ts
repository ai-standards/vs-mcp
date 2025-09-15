
import ora from "ora";
import path from "path";
import fs from "fs";
import { compileMCPX } from "../vendor/mcpx/compiler";
import { generateMarkdownDocs } from "./generate-docs";

async function main() {
  const index = await compileMCPX("src/tools/**/*.mcpx.ts");

  // create the index
  const tsOut = `// Auto-generated MCP tool index\nexport const mcpToolIndex = ${JSON.stringify(index, null, 2)};\n`;
  const outPath = path.resolve(process.cwd(), "src/server/index.ts");
  fs.writeFileSync(outPath, tsOut);

  // create the types
  const types = await generateMcpTypes(index);
  const typePath = path.resolve(process.cwd(), "src/server/types.ts");
  fs.writeFileSync(typePath, types);

  // generate markdown docs (grouped by namespace in docs/mcpx)
  await generateMarkdownDocs(index, path.resolve(process.cwd(), "docs"));

}

main().then(
    () => console.log('Completed build')
)

// generateMcpTypes.ts
export type MCPToolIndex = {
  tools: Array<{
    id: string;
    namespace: string;
    name?: string;
    description?: string;
    path?: string;
    input?: Record<
      string,
      { type: string; required?: boolean; items?: { type: string } }
    >;
    output?: Record<
      string,
      { type: string; required?: boolean; items?: { type: string } }
    >;
  }>;
};

/**
 * Generate TypeScript definitions for an MCP tool index.
 * Returns a complete .ts file as a string (no I/O).
 */
export function generateMcpTypes(
  mcpToolIndex: MCPToolIndex,
  opts?: {
    /**
     * Add a stubbed `runTool` function to the output. Default: true
     */
    emitRuntimeStub?: boolean;
    /**
     * Also emit a lightweight descriptor array for UI/UX (id/path/name/description). Default: true
     */
    includeDescriptors?: boolean;
    /**
     * File header comment. Default provided.
     */
    banner?: string;
  }
): string {
  const {
    emitRuntimeStub = true,
    includeDescriptors = true,
    banner = "// AUTO-GENERATED FROM MCP TOOL INDEX. Do not edit by hand.\n",
  } = opts ?? {};

  const tools = mcpToolIndex?.tools ?? [];
  const chunks: string[] = [];

  const pascalCase = (s: string) =>
    s
      .replace(/[^a-zA-Z0-9]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join("");

  type FieldSpec = { type: string; required?: boolean; items?: { type: string } };

  const tsTypeFromSchemaType = (spec: FieldSpec): string => {
    const t = spec?.type?.toLowerCase();
    switch (t) {
      case "string":
      case "number":
      case "boolean":
        return t;
      case "object":
        return "Record<string, unknown>";
      case "array":
        return `${tsTypeFromSchemaType(spec.items ?? { type: "unknown" })}[]`;
      case "null":
        return "null";
      case "unknown":
      case undefined:
        return "unknown";
      default:
        // allow custom types or enums you may inject
        return spec.type;
    }
  };

  const renderInterface = (
    name: string,
    fields: Record<string, FieldSpec> | undefined,
    doc?: string
  ) => {
    const docBlock = doc ? `/** ${doc.replace(/\*\//g, "*\\/")} */\n` : "";
    const lines = Object.entries(fields ?? {}).map(([key, spec]) => {
      const opt = spec.required ? "" : "?";
      return `  ${JSON.stringify(key)}${opt}: ${tsTypeFromSchemaType(spec)};`;
    });
    return `${docBlock}export interface ${name} {\n${lines.join("\n")}\n}\n`;
  };

  // Banner
  chunks.push(banner);

  // Per-tool interfaces + CommandMap assembly
  const commandMapEntries: string[] = [];
  const propsKeyAliases: string[] = []; // not strictly needed but keeps intent clear

  for (const tool of tools) {
      const key = `${tool.namespace}.${tool.id}`;
      const pascal = pascalCase(key);
      const propsName = `${pascal}Props`;
      const respName = `${pascal}Response`;

      chunks.push(renderInterface(propsName, tool.input, tool.description));
      chunks.push(renderInterface(respName, tool.output));

      commandMapEntries.push(
        `  ${JSON.stringify(key)}: { props: ${propsName}; response: ${respName}; path: ${JSON.stringify(
          tool.path ?? ""
        )} };`
      );

      propsKeyAliases.push(
        `type ${pascal}PropsKey = ${JSON.stringify(`${key}Props`)};`,
        `type ${pascal}ResponseKey = ${JSON.stringify(`${key}Response`)};`
      );
  }

  // Registry types
    chunks.push(
      `export type ToolId = ${
        tools.length ? tools.map((t) => JSON.stringify(`${t.namespace}.${t.id}`)).join(" | ") : "never"
      };
  `
    );
  chunks.push(`export type CommandMap = {\n${commandMapEntries.join("\n")}\n};\n`);

  // Helpful key aliases (optional but explicit)
  if (propsKeyAliases.length) {
    chunks.push(propsKeyAliases.join("\n") + "\n");
  }

  // Conditional wrappers
  chunks.push(`
export type PropsFor<K extends keyof CommandMap> =
  { [P in \`\${Extract<K, string>}Props\`]: CommandMap[K]["props"] };

export type ResponseFor<K extends keyof CommandMap> =
  { [R in \`\${Extract<K, string>}Response\`]: CommandMap[K]["response"] };
`.trim() + "\n");

  // Optional stubbed runtime signature
  if (emitRuntimeStub) {
    chunks.push(`
/** Type-stable signature; implement elsewhere to dispatch to your actual tools. */
export async function runTool<K extends keyof CommandMap>(
  name: K,
  args: PropsFor<K>
): Promise<ResponseFor<K>> {
  throw new Error("runTool is a type-only stub generated by generateMcpTypes()");
}
`.trim() + "\n");
  }

  // Optional descriptors
  if (includeDescriptors) {
    const descriptors = tools.map((t) => ({
      id: t.id,
      namespace: t.namespace || 'default',
      path: t.path ?? "",
      name: t.name,
      description: t.description,
      input: t.input ?? {},
      output: t.output ?? {}
    }));
    chunks.push(`
export type ToolDescriptor = {
  id: ToolId;
  path: CommandMap[ToolId]["path"];
  name?: string;
  description?: string;
};

export const AllTools = ${JSON.stringify(descriptors, null, 2)} as const;
`.trim() + "\n");
  }

  return chunks.join("\n");
}
