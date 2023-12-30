import * as vscode from "vscode";
import { EnumTreeItemType } from "./maniTreeItem";

export class EnumTreeItem extends vscode.TreeItem {
  constructor(val: EnumTreeItemType) {
    super(val.label);

    this.iconPath = new vscode.ThemeIcon(val.icon);
    if (val.command) {
      this.command = val.command;
    }
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
