import { BaseCommand } from "./baseCommand";
import * as vscode from "vscode";
import { ManiStore, ManiYaml, Project } from "../mani";
import { errorHandler } from "../decorators";
import { writeYaml } from "../utils";
import { findGitProjects } from "./autoDiscoverCommand";

export class InitCommand extends BaseCommand {
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.init");
  }

  @errorHandler()
  protected async execute(): Promise<void> {
    const uri = (
      await vscode.window.showOpenDialog({
        title: "Select root folder for projects",
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
      })
    )?.pop();
    if (!uri) {
      return;
    }

    const projects = await findGitProjects(uri);

    const maniYaml: ManiYaml = {
      projects,
      tasks: {
        pull: {
          desc: "git pull",
          cmd: `git pull`,
        },
      },
    };

    const fileUri = vscode.Uri.joinPath(uri, "mani.yml");
    await writeYaml(fileUri, maniYaml);

    const document = await vscode.workspace.openTextDocument(fileUri);
    await vscode.window.showTextDocument(document);
  }
}
