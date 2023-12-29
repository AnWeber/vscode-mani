import * as vscode from "vscode";
import { TagTreeItem } from "./tagTreeItem";
import { ManiConfig, ManiProject, ManiStore, ManiTask } from "../mani";
import { EnumTreeItem } from "./enumTreeItem";
import { ProjectTreeItem } from "./projectTreeItem";
import { TaskTreeItem } from "./taskTreeItem";
import { ConfigTreeItem } from "./configTreeItem";
import { ManiTreeItem, enumTreeItem } from "./maniTreeItem";

export class ProjectTreeDataProvider
  implements vscode.TreeDataProvider<ManiTreeItem>, vscode.Disposable
{
  private disposable: vscode.Disposable;
  public readonly onDidChangeTreeData: vscode.Event<void>;

  constructor(private readonly maniStore: ManiStore) {
    this.onDidChangeTreeData = maniStore.maniConfigChanged;

    this.disposable = vscode.window.registerTreeDataProvider(
      "maniProjects",
      this
    );
  }
  public dispose() {
    this.disposable.dispose();
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
      return config.getAllTags();
    }
    if (element === enumTreeItem.All) {
      return config.getAllProjects();
    }
    if (typeof element === "string") {
      return config.getAllProjects().filter((p) => p.tags.includes(element));
    }
    return [];
  }

  private getRootItems() {
    return [
      enumTreeItem.All,
      enumTreeItem.Tags,
      enumTreeItem.Branches,
      enumTreeItem.Tasks,
      enumTreeItem.Configs,
    ];
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
    return new EnumTreeItem(element);
  }
}
