import { extensionState } from "./vsmcp";

export function setWorkspaceState<T = any>(key: string, value: T): Thenable<void> {
  return extensionState.context.workspaceState.update(key, value);
}

export function getWorkspaceState<T = any>(key: string): T | undefined {
  return extensionState.context.workspaceState.get<T>(key);
}