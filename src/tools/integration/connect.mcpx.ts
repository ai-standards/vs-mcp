
import * as vscode from "vscode";
// If connectToIntegration is the default export:
import {createContextProvider} from '../../lib/context';

export type InputContext = {
  integrationId: string;
  options?: any;
  showUI?: boolean;
};

export type OutputContext = {
  result: any;
};

/**
 * @namespace integration
 * @name Connect Integration
 * @description Connect to a specified MCP integration
 */
export default async function connectIntegration(context: InputContext): Promise<OutputContext> {
  const result = await createContextProvider(context.integrationId);
  if (context.showUI) {
    vscode.window.showInformationMessage(`Connected to integration: ${context.integrationId}`);
  }
  return { result };
}
