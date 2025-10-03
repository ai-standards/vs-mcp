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

const secretId = 'vs-mvc-api-key';

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

export async function getKey(context: vscode.ExtensionContext) {
    const key = await context.secrets.get(secretId);
    return key || await setKey(context);
}

export async function setKey(context: vscode.ExtensionContext) {
    const input = await vscode.window.showInputBox({
        prompt: "Enter your OpenAI API Key",
        ignoreFocusOut: true,
        password: true,
    });
    if (!input) throw new Error("OpenAI API Key is required.");
    const key = input.trim();
    await context.secrets.store(secretId, key);
    return key;
}

function getUri(): string {
    const config = vscode.workspace.getConfiguration('vs-mcp');
    const apiUrl = config.get<string>('apiUrl', '');
    return apiUrl || 'https://api.openai.com/v1';
}

export function getModel(): string {
    const config = vscode.workspace.getConfiguration('vs-mcp');
    return config.get<string>('model', 'gpt-4o-mini');
}