import { errorHandler } from "../decorators";
import { ManiProject, ManiStore, SpecialTags } from "../mani";
import { writeTagsToYaml } from "./addTagsCommand";
import { BaseCommand } from "./baseCommand";
import { pickProject } from "./openFolderCommand";

export class HideProjectCommand extends BaseCommand<ManiProject> {
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.hideProject");
  }
  @errorHandler()
  protected async execute(p?: ManiProject): Promise<void> {
    const config = await this.maniStore.getManiConfig();
    if (!config) {
      return;
    }
    const project =
      p instanceof ManiProject ? p : await pickProject(this.maniStore);

    if (!project) {
      return;
    }

    let tags = [...project.tags, SpecialTags.HIDDEN];
    if (project.isHidden) {
      tags = project.tags.filter((t) => t !== SpecialTags.HIDDEN);
    }
    await writeTagsToYaml(project, tags, config);
  }
}
