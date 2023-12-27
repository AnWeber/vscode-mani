import * as vscode from "vscode";
import { TagTreeItem } from "./tagTreeItem";
import { ManiStore } from "../mani";
import { AllTreeItem } from "./allTreeItem";
import { ProjectTreeItem } from "./projectTreeItem";
import { TasksTreeItem, TaskTreeItem } from "./taskTreeItem";
import { ConfigsTreeItem, ConfigTreeItem } from "./configTreeItem";

export class ProjectTreeDataProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>, vscode.Disposable
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
    element?: vscode.TreeItem | undefined
  ): Promise<vscode.TreeItem[]> {
    if (!element) {
      return await this.getRootItems();
    }
    if (element instanceof TasksTreeItem) {
      const tasks = await this.maniStore.getTasks();

      return tasks.map((task) => new TaskTreeItem(task));
    }
    if (element instanceof ConfigsTreeItem) {
      const config = await this.maniStore.getManiConfig();
      if (config) {
        const configs = [config, ...(config?.imports || [])];
        return configs.map((c) => new ConfigTreeItem(c));
      }
      return [];
    }
    return this.getProjectTreeItems();
  }

  private async getRootItems() {
    const rootItems = [new AllTreeItem()];
    const tags = await this.maniStore.getTags();
    rootItems.push(...tags.map((tag) => new TagTreeItem(tag)));
    rootItems.push(new TasksTreeItem());
    rootItems.push(new ConfigsTreeItem());
    return rootItems;
  }

  private async getProjectTreeItems(element?: vscode.TreeItem | undefined) {
    const projects = await this.maniStore.getProjects();
    if (element instanceof TagTreeItem) {
      return projects
        .filter((obj) => obj.tags.includes(element.tag))
        .map((project) => new ProjectTreeItem(project));
    }

    return projects.map((project) => new ProjectTreeItem(project));
  }

  public async getTreeItem(element: TagTreeItem): Promise<vscode.TreeItem> {
    return element;
  }
}
