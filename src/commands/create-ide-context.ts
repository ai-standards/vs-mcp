import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs/promises";
import * as fssync from "fs";
import { getContext, IdeTarget } from "../../mcp/context";

/** Slug helper for filenames */
function toSlug(input: string) {
    return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Ensure dir exists */
async function ensureDir(dir: string) {
    await fs.mkdir(dir, { recursive: true });
}

/** Write file with optional overwrite prompt */
async function writeFileWithConfirm(
    filePath: string,
    content: string,
    confirmIfExists: boolean = true
): Promise<boolean> {
    const exists = fssync.existsSync(filePath);
    if (exists && confirmIfExists) {
        const choice = await vscode.window.showWarningMessage(
            `File exists:\n${filePath}\nOverwrite?`,
            { modal: true },
            "Overwrite",
            "Skip"
        );
        if (choice !== "Overwrite") return false;
    }
    await fs.writeFile(filePath, content, "utf8");
    return true;
}

export function registerCreateIdeContext(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand("vs-mcp.createIdeContext", async () => {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders || workspaceFolders.length === 0) {
                vscode.window.showErrorMessage("No workspace folder open.");
                return;
            }
            const rootPath = workspaceFolders[0].uri.fsPath;

            // Select targets (includes "Other")
            const choices = (await vscode.window.showQuickPick(
                ["GitHub Copilot", "Cursor", "Continue.dev", "JetBrains AI Assistant", "Other"],
                { canPickMany: true, placeHolder: "Select IDEs to create context for" }
            )) as IdeTarget[] | undefined;

            if (!choices || choices.length === 0) {
                vscode.window.showInformationMessage("No IDE selected. Nothing created.");
                return;
            }

            const created: string[] = [];
            const skipped: string[] = [];
            const missing: string[] = [];

            try {
                for (const choice of choices) {
                    switch (choice) {
                        case "GitHub Copilot": {
                            const filePath = path.join(rootPath, ".github", "copilot-instructions.md");
                            await ensureDir(path.dirname(filePath));
                            const context = await getContext('GitHub Copilot');
                            const wrote = await writeFileWithConfirm(filePath, context);
                            (wrote ? created : skipped).push(filePath);
                            break;
                        }
                        case "Cursor": {
                            const rulesDir = path.join(rootPath, ".cursor", "rules");
                            await ensureDir(rulesDir);
                            const rulesPath = path.join(rulesDir, `${toSlug("mcp-context")}.mdc`);
                            const context = await getContext('Cursor');
                            const wroteRules = await writeFileWithConfirm(rulesPath, context);
                            (wroteRules ? created : skipped).push(rulesPath);
                            break;
                        }
                        case "Continue.dev": {
                            const contDir = path.join(rootPath, ".continue");
                            await ensureDir(contDir);
                            const contPath = path.join(contDir, "config.yaml");
                            const context = await getContext('Continue.dev');
                            const wrote = await writeFileWithConfirm(contPath, context);
                            (wrote ? created : skipped).push(contPath);
                            break;
                        }
                        case "JetBrains AI Assistant": {
                            const rulesDir = path.join(rootPath, ".idea", "ai", "rules");
                            await ensureDir(rulesDir);
                            const rulesPath = path.join(rulesDir, `${toSlug("mcp-context")}.md`);
                            const context = await getContext('JetBrains AI Assistant');
                            const wrote = await writeFileWithConfirm(rulesPath, context);
                            (wrote ? created : skipped).push(rulesPath);
                            break;
                        }
                        case "Other": {
                            const otherPath = path.join(rootPath, "PROJECT_CONTEXT.md");
                            const context = await getContext();
                            const wrote = await writeFileWithConfirm(otherPath, context);
                            (wrote ? created : skipped).push(otherPath);
                            break;
                        }
                    }
                }

            } catch (err: any) {
                vscode.window.showErrorMessage(`Failed to create context files: ${err?.message ?? String(err)}`);
            }

            const lines: string[] = [];
            if (created.length) lines.push(`Created:\n- ${created.join("\n- ")}`);
            if (skipped.length) lines.push(`Skipped (kept existing):\n- ${skipped.join("\n- ")}`);
            if (missing.length) lines.push(`Missing payloads (nothing written):\n- ${missing.join("\n- ")}`);
            vscode.window.showInformationMessage(lines.join("\n\n"), { modal: true });
        })
    );
}
