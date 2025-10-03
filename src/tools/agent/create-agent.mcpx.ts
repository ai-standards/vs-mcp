import * as vscode from "vscode";
import * as path from "path";
import { getClient, getModel } from "../../lib/ai";
import { getAgentContext } from "../../lib/agent";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

export type InputContext = {
    filepath?: string,
    description?: string;
};

// (optional) keep if you want a return value; not used below
export type OutputContext = InputContext & {
    code?: string | null;
};

/**
 * @namespace agent
 * @name Generate new agent
 * @description Generate a new MCP agent
 */
export default async function createAgent(context: InputContext): Promise<OutputContext> {
    const description = context.description || await vscode.window.showInputBox({
        prompt: "Enter the name or description for your new agent.",
        ignoreFocusOut: true,
        placeHolder: "e.g. Hello World Agent",
        title: "Create Agent",
        password: false,
        value: ""
    });
    if (!description) {
        vscode.window.showInformationMessage("Agent creation cancelled.");
        return {
            ...context,
            code: null
        }
    }

    const ai = await getClient();
    const agentContext = await getAgentContext();

    const prompt = `
You are creating agentic runtime extensions for Visual Studio Code.

These extensions run in the workspace and integrate with the editor via MCP servers injected at runtime.

Generate a new agent for the developer with:

- filepath: a relative path/filename slug (will be written to the chosen folder). If no extension is provided, use ".agent.js".
- code: the complete file contents including:
  - export const metadata
    - id: caterpillar case slug
    - name: text name
    - description: explain what the agent does
  - an exported async run function

Developer's description:

-----------------------
${description}
-----------------------

Available MCPs and example agent:

-----------------------
${agentContext}
-----------------------
`;

    await vscode.window.withProgress(
        {
            location: vscode.ProgressLocation.Notification,
            title: "Generating agent file...",
            cancellable: false
        },
        async () => {
            try {
                // Define the structured output schema
                const AgentFile = z.object({
                    filepath: z.string(),
                    code: z.string(),
                });
                type AgentFile = z.infer<typeof AgentFile>;

                // Use chat.completions.parse with zodResponseFormat
                    const completion = await ai.chat.completions.parse({
                        model: getModel(),
                    messages: [
                        { role: "system", content: "You are a meticulous code generator." },
                        { role: "user", content: prompt },
                    ],
                    response_format: zodResponseFormat(AgentFile, "agent_file"),
                    temperature: 0.2,
                    max_tokens: 2048,
                });

                const parsed = completion.choices[0]?.message?.parsed as AgentFile | undefined;
                if (!parsed) {
                    vscode.window.showErrorMessage("Agent generation failed: no structured output.");
                    return;
                }

                // Resolve the target directory from the clicked/selected URI
                const {filepath} = context;


                if (filepath) {
                    const fileUri = vscode.Uri.file(filepath);

                    console.log(filepath, fileUri.fsPath);

                    const stat = await vscode.workspace.fs.stat(fileUri);
                    const targetDir =
                        stat.type === vscode.FileType.Directory
                            ? fileUri
                            : vscode.Uri.file(path.dirname(fileUri.fsPath));

                    // Ensure .agent.js suffix and sanitize leading path segments
                    let filename = parsed.filepath.endsWith(".agent.js")
                        ? parsed.filepath
                        : parsed.filepath + ".agent.js";
                    filename = filename.replace(/^(\.*[\\/])+/, ""); // strip leading ../ ./ .\ etc.

                    const targetFile = vscode.Uri.file(path.join(targetDir.fsPath, filename));
                    await vscode.workspace.fs.writeFile(targetFile, Buffer.from(parsed.code, "utf8"));
                    vscode.window.showInformationMessage(`Agent file written: ${targetFile.fsPath}`);
                } else {
                      const doc = await vscode.workspace.openTextDocument({ content: parsed.code, language: 'ts' });
                      await vscode.window.showTextDocument(doc, { preview: true });
                }


                return { ...context, ...parsed } as OutputContext;
            } catch (err: any) {
                console.error(err);
                vscode.window.showErrorMessage(`Agent generation error: ${err?.message ?? String(err)}`);
            }
            return { ...context, code: null } as OutputContext;
        }
    );
}