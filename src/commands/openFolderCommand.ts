import { BaseCommand } from "./baseCommand";
import * as vscode from "vscode";
import { pickProject } from "./pickProject";
import { ManiProject, ManiStore } from "../mani";
import { errorHandler } from "../decorators";

export class OpenFolderCommand extends BaseCommand<ManiProject> {
  @errorHandler()
  protected async execute(p?: ManiProject): Promise<void> {
    const project = p || (await pickProject(this.maniStore));
    if (project?.uri) {
      vscode.commands.executeCommand("vscode.openFolder", project.uri, true);
    }
  }
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.openFolder");
  }
}
