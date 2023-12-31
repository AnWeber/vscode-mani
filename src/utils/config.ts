import * as vscode from "vscode";

export function getConfig(): ManiConfiguration {
  return vscode.workspace.getConfiguration("mani");
}

export interface ManiConfiguration {
  get(section: "maniConfigFile"): string;
  get(section: "openProjectsInNewFolder"): boolean;
  get(section: "hideBranches"): Array<string> | undefined;
  get(section: "hideTags"): Array<string> | undefined;
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
