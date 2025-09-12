import * as vscode from "vscode";
import { listAgents } from "./agent";

export class VsMvcTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
  ) {
    super(label, collapsibleState);
  }
}

export class VsMvcTreeDataProvider implements vscode.TreeDataProvider<VsMvcTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<VsMvcTreeItem | null | undefined> = new vscode.EventEmitter<VsMvcTreeItem | null | undefined>();
  readonly onDidChangeTreeData: vscode.Event<VsMvcTreeItem | null | undefined> = this._onDidChangeTreeData.event;

  getTreeItem(element: VsMvcTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: VsMvcTreeItem): Thenable<VsMvcTreeItem[]> {
    if (!element) {
        return listAgents().then(agents => agents.map(a => new VsMvcTreeItem(a.name, vscode.TreeItemCollapsibleState.None)))
    }
    // No children for now
    return Promise.resolve([]);
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
