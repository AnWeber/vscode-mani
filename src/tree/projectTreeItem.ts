import * as vscode from "vscode";
import { ManiProject } from "../mani";

export class ProjectTreeItem extends vscode.TreeItem {
  constructor(project: ManiProject) {
    super(project.label);
    this.iconPath = new vscode.ThemeIcon("repo");

    this.description = project.description;
    this.command = {
      command: "mani.openFolder",
      arguments: [project],
      title: "open Folder",
    };
  }
}
