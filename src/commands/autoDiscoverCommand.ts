import { basename } from "path";
import * as vscode from "vscode";

import { errorHandler } from "../decorators";
import { logger } from "../initOutputChannel";
import { ManiStore, ManiYaml, Project } from "../mani";
import { equalsPath, writeYaml } from "../utils";
import { runShell } from "../utils";
import { BaseCommand } from "./baseCommand";

export class AutoDiscoverCommand extends BaseCommand {
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.autodiscover", "mani.init");
  }

  @errorHandler()
  protected async execute(): Promise<void> {
    let uri = await this.autoDiscover();

    if (!uri) {
      uri = await this.initConfig();
    }

    if (uri) {
      const document = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(document);
    }
  }

  private async autoDiscover(): Promise<vscode.Uri | undefined> {
    const config = await this.maniStore.getManiConfig();
    if (config?.uri) {
      const basePath = vscode.Uri.joinPath(config.uri, "..");
      const projects = config.getAllProjects();
      const newProjects = await this.findGitProjects(basePath, (uri) =>
        projects.every((project) => !equalsPath(uri, project.uri))
      );

      const originalConfig = config.raw;

      originalConfig.projects = {
        ...originalConfig.projects,
        ...newProjects,
      };

      await writeYaml(config.uri, originalConfig);
      return config.uri;
    }
    return undefined;
  }

  protected async initConfig(): Promise<vscode.Uri | undefined> {
    const uri = (
      await vscode.window.showOpenDialog({
        title: "Select root folder for projects",
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
      })
    )?.pop();
    if (!uri) {
      return undefined;
    }

    const projects = await this.findGitProjects(uri);

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

    return uri;
  }

  private async findGitProjects(
    basePath: vscode.Uri,
    predicate?: (uri: vscode.Uri) => boolean
  ): Promise<Record<string, Project>> {
    const projects: Array<Project> = [];
    const pattern = new vscode.RelativePattern(basePath, "**/.git/HEAD");

    const files = await vscode.workspace.findFiles(pattern, null);

    if (files.length > 0) {
      const newFiles = files
        .map((file) => vscode.Uri.joinPath(file, "..", ".."))
        .filter((uri) => !predicate || predicate(uri));

      for (const uri of newFiles) {
        const project: Project = {
          path: `.${uri.fsPath.split(basePath.fsPath).pop()}`,
        };
        try {
          project.url = await runShell("git config --get remote.origin.url", {
            cwd: uri.fsPath,
          });
        } catch (err) {
          logger.error(`${uri.fsPath} has no remote`, err);
        }
        projects.push(project);
      }
    }
    return projects.reduce((prev, curr) => {
      if (curr.path) {
        prev[basename(curr.path)] = curr;
      }
      return prev;
    }, {} as Record<string, Project>);
  }
}
