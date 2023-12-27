import * as vscode from "vscode";

export class AllTreeItem extends vscode.TreeItem {
  constructor() {
    super("All");
    this.iconPath = new vscode.ThemeIcon("project");
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
  }
}
