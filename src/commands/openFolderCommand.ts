import * as vscode from "vscode";

import { errorHandler } from "../decorators";
import { ManiProject, ManiStore } from "../mani";
import { BaseCommand } from "./baseCommand";

export class OpenFolderCommand extends BaseCommand<ManiProject> {
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.openFolder");
  }
  @errorHandler()
  protected async execute(p?: ManiProject): Promise<void> {
    const project = p || (await pickProject(this.maniStore));
    project?.openFolder();
  }
}
export async function pickProject(
  maniStore: ManiStore
): Promise<ManiProject | undefined> {
  const config = await maniStore.getManiConfig();
  if (!config) {
    return;
  }
  const project = await vscode.window.showQuickPick(config.getAllProjects(), {
    matchOnDetail: true,
    matchOnDescription: true,
  });

  return project;
}
