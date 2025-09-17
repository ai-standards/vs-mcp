
import * as vscode from "vscode";
import { listContextProviders } from '../../lib/context';

export type InputContext = {
  showUI?: boolean;
};

export type OutputContext = {
  integrations: any[];
};

/**
 * @namespace integration
 * @name List Integrations
 * @description List all available MCP integrations
 */
export default async function listIntegrations(context: InputContext = {}): Promise<OutputContext> {
  const integrations = await listContextProviders();
  return { integrations };
}
