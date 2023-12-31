import * as vscode from "vscode";

import { GitBranch } from "../git";

export class GitBranchTreeItem extends vscode.TreeItem {
  public constructor(branch: GitBranch) {
    super(branch.name);
    this.iconPath = new vscode.ThemeIcon("git-branch");
    this.contextValue = "branch";

    if (branch.projects.length > 0) {
      this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    }
  }
}
