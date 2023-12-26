import { BaseCommand } from "./baseCommand";
import * as vscode from "vscode";
import { pickProject } from "./pickProject";
import { ManiStore } from "../mani";
import { errorHandler } from "../decorators";

export class OpenFolderCommand extends BaseCommand {
  @errorHandler()
  protected async execute(): Promise<void> {
    const project = await pickProject(this.maniStore);
    if (project?.uri) {
      vscode.commands.executeCommand("vscode.openFolder", project.uri, true);
    }
  }
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.openFolder");
  }
}
