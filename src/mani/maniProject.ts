import { commands, Uri, workspace } from "vscode";

import { getConfig } from "../utils";
import { Project } from "./maniYaml";
import { SpecialTags } from "./specialTags";

export class ManiProject {
  public constructor(
    public readonly name: string,
    public readonly uri: Uri,
    public readonly raw: Project,
    public readonly configPath: string | undefined
  ) {}

  public get label(): string {
    return this.name;
  }
  public get description(): string | undefined {
    return this.raw.desc || this.raw.tags?.join(", ");
  }
  public get detail(): string | undefined {
    return this.raw.path;
  }
  public get tags(): Array<string> {
    return this.raw.tags || [];
  }

  public get icon(): string {
    const iconTag = this.tags.find((t) => t.startsWith(SpecialTags.ICON));

    return iconTag?.slice(SpecialTags.ICON.length) || "repo";
  }

  public get isHidden(): boolean {
    return this.tags.some((t) => t === SpecialTags.HIDDEN);
  }

  public openFolder(): void {
    commands.executeCommand(
      "vscode.openFolder",
      this.uri,
      getConfig().get("openProjectsInNewFolder")
    );
  }
}
