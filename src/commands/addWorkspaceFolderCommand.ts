import { errorHandler } from "../decorators";
import { ManiProject, ManiStore } from "../mani";
import { BaseCommand } from "./baseCommand";
import { pickProject } from "./openFolderCommand";

export class AddWorkspaceFolderCommand extends BaseCommand<ManiProject> {
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.addWorkspaceFolder");
  }
  @errorHandler()
  protected async execute(p?: ManiProject): Promise<void> {
    const project = p || (await pickProject(this.maniStore));
    project?.addToWorkspace();
  }
}
