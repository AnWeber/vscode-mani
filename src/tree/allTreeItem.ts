import * as vscode from "vscode";

export class AllTreeItem extends vscode.TreeItem {
  constructor() {
    super("All");
    this.iconPath = new vscode.ThemeIcon("project");
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
  }
}

export class InitTreeItem extends vscode.TreeItem {
  constructor() {
    super("Please init a mani Configuration");
    this.iconPath = new vscode.ThemeIcon("new-file");
    this.command = {
      command: "mani.init",
      title: "init",
    };
  }
}
