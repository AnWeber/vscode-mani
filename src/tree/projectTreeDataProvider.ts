import * as vscode from "vscode";

import { GitBranch, GitStore } from "../git";
import { ManiConfig, ManiProject, ManiStore, ManiTask } from "../mani";
import { getConfig } from "../utils";
import { ConfigTreeItem } from "./configTreeItem";
import { EnumTreeItem } from "./enumTreeItem";
import { GitBranchTreeItem } from "./gitBranchTreeItem";
import { enumTreeItem, ManiTreeItem } from "./maniTreeItem";
import { ProjectTreeItem } from "./projectTreeItem";
import { TagTreeItem } from "./tagTreeItem";
import { TaskTreeItem } from "./taskTreeItem";

export class ProjectTreeDataProvider
  implements vscode.TreeDataProvider<ManiTreeItem>, vscode.Disposable
{
  private readonly disposables: Array<vscode.Disposable>;
  public readonly onDidChangeTreeData: vscode.Event<void>;

  constructor(
    private readonly maniStore: ManiStore,
    private readonly gitStore: GitStore
  ) {
    const onDidChangeTreeDataEmitter = new vscode.EventEmitter<void>();
    this.onDidChangeTreeData = onDidChangeTreeDataEmitter.event;

    this.disposables = [
      onDidChangeTreeDataEmitter,
      maniStore.maniConfigChanged(() => {
        onDidChangeTreeDataEmitter.fire();
      }),
      vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("mani.visibleTreeItemRoots")) {
          onDidChangeTreeDataEmitter.fire();
        }
      }),
      vscode.window.registerTreeDataProvider("maniProjects", this),
    ];
  }
  public dispose() {
    this.disposables.forEach((d) => d.dispose());
  }

  public async getChildren(
    element?: ManiTreeItem | undefined
  ): Promise<Array<ManiTreeItem>> {
    const config = await this.maniStore.getManiConfig();
    if (!config) {
      return [enumTreeItem.Init];
    }
    if (!element) {
      return this.getRootItems();
    }
    if (element === enumTreeItem.Tasks) {
      return config.getAllTasks();
    }
    if (element === enumTreeItem.Configs) {
      return [config, ...(config?.imports || [])];
    }
    if (element === enumTreeItem.Tags) {
      const hideTags = getConfig().get("hideTags");
      const tags: Array<ManiTreeItem> = config
        .getAllUserTags()
        .filter((t) => !hideTags?.includes(t));
      if (config.getAllProjects().some((p) => p.tags.length === 0)) {
        tags.push(enumTreeItem.NoTags);
      }
      return tags;
    }
    if (element === enumTreeItem.NoTags) {
      return config.getAllProjects().filter((p) => p.tags.length === 0);
    }
    if (element === enumTreeItem.All) {
      return config.getAllProjects();
    }
    if (element === enumTreeItem.Branches) {
      const branches = await this.gitStore.getBranches();
      const hideBranches = getConfig().get("hideBranches");
      return branches.filter((b) => !hideBranches?.includes(b.name));
    }
    if (element instanceof GitBranch) {
      return element.projects;
    }
    if (element instanceof ManiConfig) {
      return element.projects;
    }
    if (typeof element === "string") {
      return config.getAllProjects().filter((p) => p.tags.includes(element));
    }
    return [];
  }

  private getRootItems() {
    const children: Array<ManiTreeItem> = [];
    const rootItems = getConfig().get("visibleTreeItemRoots");
    if (rootItems?.All) {
      children.push(enumTreeItem.All);
    }
    if (rootItems?.Tags) {
      children.push(enumTreeItem.Tags);
    }
    if (rootItems?.Branches) {
      children.push(enumTreeItem.Branches);
    }
    if (rootItems?.Tasks) {
      children.push(enumTreeItem.Tasks);
    }
    if (rootItems?.Configs) {
      children.push(enumTreeItem.Configs);
    }
    return children;
  }

  public async getTreeItem(element: ManiTreeItem): Promise<vscode.TreeItem> {
    if (element instanceof ManiProject) {
      return new ProjectTreeItem(element);
    }
    if (element instanceof ManiTask) {
      return new TaskTreeItem(element);
    }
    if (typeof element === "string") {
      return new TagTreeItem(element);
    }
    if (element instanceof ManiConfig) {
      return new ConfigTreeItem(element);
    }
    if (element instanceof GitBranch) {
      return new GitBranchTreeItem(element);
    }
    return new EnumTreeItem(element);
  }
}
