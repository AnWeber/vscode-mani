import * as vscode from "vscode";
import { ManiConfig } from "../mani";
import { basename } from "path";
export class ConfigsTreeItem extends vscode.TreeItem {
  constructor() {
    super("Config");
    this.iconPath = new vscode.ThemeIcon("gear");

    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
  }
}

export class ConfigTreeItem extends vscode.TreeItem {
  public constructor(config: ManiConfig) {
    super(config.path || basename(config.uri.fsPath));
    this.iconPath = new vscode.ThemeIcon("gear");
    this.description = config.uri.fsPath;
    this.command = {
      command: "mani.editConfig",
      arguments: [config],
      title: "edit",
    };
  }
}
