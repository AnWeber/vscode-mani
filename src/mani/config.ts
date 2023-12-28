import * as vscode from "vscode";

export function getConfig(): ManiConfiguration {
  return vscode.workspace.getConfiguration("mani");
}

export interface ManiConfiguration {
  get(section: "openProjectsInNewFolder"): boolean;
}
