import * as agent from "../../lib/agent";

export type InputContext = {};

export type OutputContext = {
  agents: Array<{
    id: string;
    name: string;
    description?: string;
    path?: string;
  }>;
};

/**
 * @namespace agent
 * @name List Agents
 * @description List all MCP agents in the project
 */
export default async function listAgents(context: InputContext): Promise<OutputContext> {
  const agents = await agent.listAgents();
  return { agents };
}
