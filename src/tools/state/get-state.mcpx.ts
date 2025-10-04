import { getWorkspaceState } from "../../lib/state";

export interface InputContext {
  key: string;
}

export interface OutputContext {
  value: any;
}

/**
 * @namespace state
 * @name Get State
 * @description Get a value from the extension workspace state.
 */
export default async function getState(context: InputContext): Promise<OutputContext> {
  const { key } = context;
  const value = getWorkspaceState(key);
  return { value };
}
