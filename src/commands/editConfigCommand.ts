import { BaseCommand } from "./baseCommand";
import * as vscode from "vscode";
import { ManiConfig, ManiStore } from "../mani";
import { errorHandler } from "../decorators";
import { basename } from "path";

export class EditConfigCommand extends BaseCommand<ManiConfig> {
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.editConfig");
  }
  @errorHandler()
  protected async execute(c?: ManiConfig): Promise<void> {
    const config = c instanceof ManiConfig ? c : await this.pickConfig();
    if (config?.uri) {
      const document = await vscode.workspace.openTextDocument(config.uri);
      await vscode.window.showTextDocument(document);
    }
  }

  private async pickConfig(): Promise<ManiConfig | undefined> {
    const configs: Array<ManiConfig> = [];
    const config = await this.maniStore.getManiConfig();
    if (config) {
      configs.push(config);
      if (config.imports) {
        configs.push(...config.imports);
      }
    }

    const picks = configs.map((c) => ({
      label: c.path || basename(c.uri.fsPath),
      config: c,
    }));

    const pick = await vscode.window.showQuickPick(picks, {
      matchOnDetail: true,
      matchOnDescription: true,
    });

    return pick?.config;
  }
}
