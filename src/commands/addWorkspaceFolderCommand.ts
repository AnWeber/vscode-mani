import { Uri, workspace } from "vscode";

import { errorHandler } from "../decorators";
import { GitBranch } from "../git";
import { ManiProject, ManiStore } from "../mani";
import { BaseCommand } from "./baseCommand";
import { pickProject } from "./openFolderCommand";

export class AddWorkspaceFolderCommand extends BaseCommand<ManiProject> {
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.addWorkspaceFolder");
  }
  @errorHandler()
  protected async execute(
    arg?: ManiProject | string | GitBranch
  ): Promise<void> {
    if (typeof arg === "string") {
      const config = await this.maniStore.getManiConfig();
      if (config) {
        const projects = config
          .getAllProjects()
          .filter((p) => p.tags.includes(arg));
        this.addToWorkspace(projects);
      }
      return;
    }
    if (arg instanceof GitBranch) {
      this.addToWorkspace(arg.projects);
      return;
    }
    const project =
      arg instanceof ManiProject ? arg : await pickProject(this.maniStore);
    if (project) {
      this.addToWorkspace([project]);
    }
  }

  private addToWorkspace(projects: Array<ManiProject>) {
    const workspaceFolders = workspace.workspaceFolders || [];
    const folders: Array<{ uri: Uri; name?: string }> = [...workspaceFolders];

    for (const p of projects) {
      const uriString = p.uri.toString();
      if (!folders.some((f) => f.uri.toString() === uriString)) {
        folders.push({
          name: p.name,
          uri: p.uri,
        });
      }
    }
    workspace.updateWorkspaceFolders(0, workspaceFolders.length, ...folders);
  }
}
