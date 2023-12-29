import * as vscode from "vscode";
import { ManiProject, SpecialTag } from "../mani";

export class ProjectTreeItem extends vscode.TreeItem {
  constructor(project: ManiProject) {
    super(project.label);
    this.contextValue = "project";
    this.iconPath = new vscode.ThemeIcon("repo");

    const iconTag = project.tags.find((tag) => tag.startsWith(SpecialTag.ICON));

    if (iconTag) {
      this.iconPath = new vscode.ThemeIcon(
        iconTag.slice(SpecialTag.ICON.length)
      );
    }

    this.description = project.detail;
    this.tooltip = "Open Folder";
    this.command = {
      command: "mani.openFolder",
      arguments: [project],
      title: "Open Folder",
    };
  }
}
