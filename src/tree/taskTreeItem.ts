import * as vscode from "vscode";
import { ManiTask } from "../mani";

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
