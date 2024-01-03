import * as vscode from "vscode";

import { errorHandler } from "../decorators";
import { ManiProject, ManiStore } from "../mani";
import { BaseCommand } from "./baseCommand";
import { pickProject } from "./openFolderCommand";

export class OpenGitCommand extends BaseCommand<ManiProject> {
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.openGit");
  }
  @errorHandler()
  protected async execute(p?: ManiProject): Promise<void> {
    const project = p || (await pickProject(this.maniStore));

    const url = project?.raw.url;
    if (url) {
      vscode.env.openExternal(vscode.Uri.parse(url));
    }
  }
}
