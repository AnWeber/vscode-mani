import { basename } from "path";
import * as vscode from "vscode";

import { ManiConfig } from "../mani";

export class ConfigTreeItem extends vscode.TreeItem {
  public constructor(config: ManiConfig) {
    super(config.path || basename(config.uri.fsPath));
    this.iconPath = new vscode.ThemeIcon("gear");
    this.description = config.uri.fsPath;
    this.contextValue = "config";
    this.command = {
      command: "mani.editConfig",
      arguments: [config],
      title: "edit",
    };
    if (config.projects.length > 0) {
      this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    }
  }
}
