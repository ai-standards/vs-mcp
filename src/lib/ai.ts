import * as vscode from "vscode";
import OpenAI from "openai";

export type AiClientOptions = AiClientOptionsWithContext 
| AiClientOptionsWithKey;

export interface AiClientOptionsWithContext {
    context: vscode.ExtensionContext;
}

export interface AiClientOptionsWithKey {
    apiKey: string;
}

let _client: OpenAI | undefined;
let _context: vscode.ExtensionContext | undefined;
let _key: string | undefined;

export async function loadClient(context: vscode.ExtensionContext): Promise<void> {
    _context = context;
    _key = await getKey(context);
    _client = new OpenAI({ apiKey: _key, baseURL: getUri() });
}

export async function getClient(): Promise<OpenAI> {
    if (!_client) {
        if (!_context) {
            throw new Error("Client not loaded. Call loadClient(context) first.");
        }
        _key = await getKey(_context);
        _client = new OpenAI({ apiKey: _key, baseURL: getUri() });
    }
    return _client;
}

async function getKey(context: vscode.ExtensionContext) {
    const secretId = 'vs-mvc-api-key';
    let key = await context.secrets.get(secretId);
    if (!key) {
        const input = await vscode.window.showInputBox({
            prompt: "Enter your OpenAI API Key",
            ignoreFocusOut: true,
            password: true,
        });
        if (!input) throw new Error("OpenAI API Key is required.");
        await context.secrets.store(secretId, input.trim());
        key = input.trim();
    }
    return key!;
}

function getUri(): string {
    const config = vscode.workspace.getConfiguration('vs-mcp');
    const apiUrl = config.get<string>('apiUrl', '');
    return apiUrl || 'https://api.openai.com/v1';
}