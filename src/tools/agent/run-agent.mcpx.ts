import { AgentScope, callAgent, listAgents } from "../../lib/agent";
import * as vscode from "vscode";

export type InputContext = {
    filepath?: string,
    scope?: AgentScope
};

// (optional) keep if you want a return value; not used below
export type OutputContext = InputContext & {
    response?: unknown;
};

/** 
 * @namespace agent
 * @name Generate new agent
 * @description Generate a new MCP agent
 */
export default async function runAgent(context: InputContext): Promise<OutputContext> {
    const scope = context.scope || {
        // the scope filepath is the original file the person clicked if they ran this from an explorer menu
        filepath: context.filepath
    }
    const agents = await listAgents();
    let filepath = context.filepath;
    if (! filepath || agents.findIndex(a => a.path === filepath) < 0) {
        // Show QuickPick to select agent
        const items = agents.map(agent => ({ label: agent.name || agent.id, description: agent.description || '', path: agent.path }));
        const pick = await (vscode.window.showQuickPick || require('vscode').window.showQuickPick)(items, {
            placeHolder: 'Select an agent to run',
            title: 'Select Agent',
        });
        if (pick) {
            filepath = pick.path;
        } else {
            // User cancelled selection
            return { ...context };
        }
    }
    const res = await callAgent(filepath as string, scope);
    return {...context} 
}