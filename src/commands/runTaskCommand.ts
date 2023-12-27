import { BaseCommand } from "./baseCommand";
import * as vscode from "vscode";
import { ManiStore, ManiTask } from "../mani";
import { errorHandler } from "../decorators";
import { createTerminal } from "../utils";

export class RunTaskCommand extends BaseCommand<ManiTask> {
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.runTask");
  }

  @errorHandler()
  protected async execute(t?: ManiTask): Promise<void> {
    const task = t || (await this.pickTasks());
    if (task) {
      const terminal = createTerminal();

      terminal.sendText(`mani run ${task.label}`);

      terminal.show(true);
    }
  }

  private async pickTasks(): Promise<ManiTask | undefined> {
    const tasks = await this.maniStore.getTasks();
    const task = await vscode.window.showQuickPick(tasks, {
      matchOnDetail: true,
      matchOnDescription: true,
    });

    return task;
  }
}
