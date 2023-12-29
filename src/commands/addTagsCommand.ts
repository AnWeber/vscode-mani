import { BaseCommand } from "./baseCommand";
import { ManiConfig, ManiProject, ManiStore } from "../mani";
import { errorHandler } from "../decorators";
import { pickProject } from "./openFolderCommand";
import * as vscode from "vscode";
import { writeYaml } from "../utils";

export class AddTagsCommand extends BaseCommand<ManiProject> {
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.addTags");
  }
  @errorHandler()
  protected async execute(p?: ManiProject): Promise<void> {
    const config = await this.maniStore.getManiConfig();
    if (!config) {
      return;
    }
    const project = p || (await pickProject(this.maniStore));
    if (!(project instanceof ManiProject)) {
      return;
    }
    const tags = await this.pickTagsOfProject(config, project);
    if (tags) {
      await this.writeTagsToYaml(project, tags, config);
    }
  }

  private async pickTagsOfProject(
    config: ManiConfig,
    project: ManiProject
  ): Promise<Array<string> | undefined> {
    const tagQuickPickItems: Array<vscode.QuickPickItem> = [
      ...config.getAllTags().map((tag) => ({
        label: tag,
        picked: project.tags.includes(tag),
      })),
    ];

    const disposables: Array<vscode.Disposable> = [];

    let disposeOnHide = true;
    return new Promise<Array<string> | undefined>((resolve) => {
      const quickPick = vscode.window.createQuickPick();

      quickPick.items = tagQuickPickItems;
      quickPick.selectedItems = tagQuickPickItems.filter((p) => p.picked);
      quickPick.canSelectMany = true;
      quickPick.buttons = [
        {
          iconPath: new vscode.ThemeIcon("add"),
          tooltip: "Add New Tag",
        },
      ];
      disposables.push(quickPick);
      disposables.push(
        quickPick.onDidTriggerButton(async () => {
          disposeOnHide = false;
          quickPick.hide();
          const newTag = await vscode.window.showInputBox({
            placeHolder: "Add New Tag",
          });
          if (newTag) {
            tagQuickPickItems.push({
              label: newTag,
              picked: true,
            });
            quickPick.items = tagQuickPickItems;
            quickPick.selectedItems = tagQuickPickItems.filter(
              (obj) => obj.picked
            );
          }
          disposeOnHide = true;
          quickPick.show();
        }),
        quickPick.onDidHide(() => {
          if (disposeOnHide) {
            disposables.forEach((d) => d.dispose());
            resolve(undefined);
          }
        }),
        quickPick.onDidAccept(() => {
          resolve(
            quickPick.selectedItems
              .filter((obj) => obj.picked)
              .map((obj) => obj.label)
          );
          disposables.forEach((d) => d.dispose());
        })
      );
      quickPick.show();
    });
  }

  private async writeTagsToYaml(
    project: ManiProject,
    tags: string[],
    config: ManiConfig
  ) {
    project.raw.tags = tags;

    let saveConfig: ManiConfig | undefined = config;
    if (project.configPath) {
      saveConfig = config.imports.find(
        (obj) => obj.path === project.configPath
      );
    }
    saveConfig && (await writeYaml(saveConfig.uri, saveConfig.raw));
  }
}
