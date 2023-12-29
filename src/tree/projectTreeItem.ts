import * as vscode from "vscode";
import { ManiProject } from "../mani";

export class ProjectTreeItem extends vscode.TreeItem {
  constructor(project: ManiProject) {
    super(project.label);
    this.contextValue = "project";
    this.iconPath = new vscode.ThemeIcon("repo");

    this.description = project.detail;
    this.tooltip = "Open Folder";
    this.command = {
      command: "mani.openFolder",
      arguments: [project],
      title: "Open Folder",
    };
  }
}
