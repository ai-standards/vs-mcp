// src/lib/commands/create-agent.ts
import * as vscode from "vscode";
import { getClient } from "../providers/openai";
import { mcpContext } from "../context/mcps";
import * as path from "path";

// create an agent that prompts the user for their name, then generates a react profile page for them

export async function activateCreateAgent(context: vscode.ExtensionContext) {
  const createAgentDisposable = vscode.commands.registerCommand("vs-mcp.createAgent", async (fileUri: vscode.Uri) => {
    const agentName = await vscode.window.showInputBox({
      prompt: "Enter the name or description for your new agent.",
      ignoreFocusOut: true,
      placeHolder: "e.g. Hello World Agent",
      title: "Create Agent",
      password: false,
      value: ""
    });
    if (!agentName) {
      vscode.window.showInformationMessage("Agent creation cancelled.");
      return;
    }
    
    const ai = await getClient(context);

    const prompt = `
You are creating agentic runtime extensions for Visual Studio Code.

These extensions are running in the IDE project, so they integrate with the IDE through a set of MCP
servers which are injected into the function at runtime.

Following the example in this example generate a new agent for the developer. The agent should have:

- filename: the filename slug, will become filename.agent.js
- text: the complete file text. this should include
  - metadata
  - run function

Here's a description of the extension the developer wants to create: 

-----------------------

${agentName}

-----------------------

Here's the complete list of available MCPs and an example of how to create a MCP Agent Extension:

-----------------------

${mcpContext}

`;

    // Show indeterminate progress window
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Generating agent file...",
      cancellable: false
    }, async () => {
      const res = await ai.generateFile(prompt);
      // write the file using relative to the fileUri
      let targetDir: vscode.Uri;
      const stat = await vscode.workspace.fs.stat(fileUri);
      if (stat.type === vscode.FileType.Directory) {
        targetDir = fileUri;
      } else {
        targetDir = vscode.Uri.file(path.dirname(fileUri.fsPath));
      }
      if (!res || !res.filename || !res.text) {
        vscode.window.showErrorMessage('Agent generation failed or returned incomplete result.');
        return;
      }
      const targetFile = vscode.Uri.file(path.join(targetDir.fsPath, res.filename.endsWith('.agent.js') ? res.filename : res.filename + '.agent.js'));
      await vscode.workspace.fs.writeFile(targetFile, Buffer.from(res.text, 'utf8'));
      vscode.window.showInformationMessage(`Agent file written: ${targetFile.fsPath}`);
    });
  });

  context.subscriptions.push(createAgentDisposable);
}
