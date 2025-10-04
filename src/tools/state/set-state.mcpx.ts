import { setWorkspaceState } from "../../lib/state";

export interface InputContext {
  key: string;
  value: any;
}

export interface OutputContext {
  success: boolean;
}

/**
 * @namespace state
 * @name Set State
 * @description Set a value in the extension workspace state.
 */
export default async function setState(context: InputContext): Promise<OutputContext> {
  const { key, value } = context;
  try {
    await setWorkspaceState(key, value);
    return { success: true };
  } catch {
    return { success: false };
  }
}
