import * as vscode from "vscode";

export function getConfig(): ManiConfiguration {
  return vscode.workspace.getConfiguration("mani");
}

export interface ManiConfiguration {
  get(section: "maniConfigFile"): string;
  get(section: "jiraUrl"): string;
  get(section: "openProjectsInNewFolder"): boolean;
  get(section: "branchView.hiddenByName"): Array<string> | undefined;
  get(section: "branchView.hiddenByTag"): Array<string> | undefined;
  get(section: "tagView.hiddenByName"): Array<string> | undefined;
  get(section: "visibleTreeItemRoots"):
    | {
        All: true;
        Tags: true;
        Configs: true;
        Tasks: true;
        Branches: true;
      }
    | undefined;
}
