import * as vscode from "vscode";
import { ManiTask } from "../mani";
export class TasksTreeItem extends vscode.TreeItem {
  constructor() {
    super("Tasks");
    this.iconPath = new vscode.ThemeIcon("tasklist");

    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
  }
}

export class TaskTreeItem extends vscode.TreeItem {
  constructor(task: ManiTask) {
    super(task.label);
    this.iconPath = new vscode.ThemeIcon("play");
    this.description = task.description;
    this.command = {
      command: "mani.runTask",
      arguments: [task],
      title: "runTask",
    };
  }
}
