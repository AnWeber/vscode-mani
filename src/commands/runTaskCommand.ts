import * as vscode from "vscode";

import { errorHandler } from "../decorators";
import { ManiStore, ManiTask } from "../mani";
import { BaseCommand } from "./baseCommand";

export class RunTaskCommand extends BaseCommand<ManiTask> {
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.runTask");
  }

  @errorHandler()
  protected async execute(t?: ManiTask): Promise<void> {
    const task = t || (await this.pickTasks());
    if (task) {
      await task.runInTerminal();
    }
  }

  private async pickTasks(): Promise<ManiTask | undefined> {
    const config = await this.maniStore.getManiConfig();
    if (!config) {
      return;
    }
    const task = await vscode.window.showQuickPick(config.getAllTasks(), {
      matchOnDetail: true,
      matchOnDescription: true,
    });

    return task;
  }
}
