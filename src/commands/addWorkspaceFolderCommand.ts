import { BaseCommand } from "./baseCommand";
import * as vscode from "vscode";
import { pickProject } from "./pickProject";
import { ManiStore } from "../mani";
import { errorHandler } from "../decorators";

export class AddWorkspaceFolderCommand extends BaseCommand {
  @errorHandler()
  protected async execute(): Promise<void> {
    const project = await pickProject(this.maniStore);
    if (project?.uri) {
      vscode.workspace.updateWorkspaceFolders(0, 0, {
        name: project.label,
        uri: project.uri,
      });
    }
  }
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.addWorkspaceFolder");
  }
}
