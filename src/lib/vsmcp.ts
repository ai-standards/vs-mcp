import * as vscode from "vscode";

class ExtensionState {
  private static _instance: ExtensionState;
  private _context: vscode.ExtensionContext | undefined;

  private constructor() {}

  static get instance(): ExtensionState {
    if (!ExtensionState._instance) {
      ExtensionState._instance = new ExtensionState();
    }
    return ExtensionState._instance;
  }

  static setContext(context: vscode.ExtensionContext) {
    ExtensionState.instance._context = context;
  }

  get context(): vscode.ExtensionContext {
    if (!this._context) {
      throw new Error("Extension context not set.");
    }
    return this._context;
  }
}

export const extensionState = ExtensionState.instance;

// Usage:
// ExtensionState.setContext(context); // in your extension activation
// extensionState.context.workspaceState // anywhere in your code