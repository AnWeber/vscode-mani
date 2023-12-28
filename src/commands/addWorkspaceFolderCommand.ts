import { BaseCommand } from "./baseCommand";
import { pickProject } from "./openFolderCommand";
import { ManiStore } from "../mani";
import { errorHandler } from "../decorators";

export class AddWorkspaceFolderCommand extends BaseCommand {
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.addWorkspaceFolder");
  }
  @errorHandler()
  protected async execute(): Promise<void> {
    const project = await pickProject(this.maniStore);
    project?.addToWorkspace();
  }
}
