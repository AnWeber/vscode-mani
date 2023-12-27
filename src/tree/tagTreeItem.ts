import * as vscode from "vscode";

export class TagTreeItem extends vscode.TreeItem {
  public readonly tag: string;
  constructor(tag: string) {
    super(tag);
    this.tag = tag;
    this.iconPath = new vscode.ThemeIcon("tag");

    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
  }
}
