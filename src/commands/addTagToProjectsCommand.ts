import * as vscode from "vscode";

import { errorHandler } from "../decorators";
import { ManiConfig, ManiStore } from "../mani";
import { writeYaml } from "../utils";
import { BaseCommand } from "./baseCommand";

export class AddTagToProjectsCommand extends BaseCommand<string> {
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.addTagToProjects");
  }
  @errorHandler()
  protected async execute(t: string | undefined): Promise<void> {
    const tag =
      typeof t === "string"
        ? t
        : await vscode.window.showInputBox({
            title: "Input New Tag",
          });
    if (!tag || typeof tag !== "string") {
      return;
    }
    const config = await this.maniStore.getManiConfig();
    if (!config) {
      return;
    }

    const allProjects = config.getAllProjects();

    const projectsWithTag = allProjects.filter((p) => p.tags.includes(tag));
    const projects = (
      await vscode.window.showQuickPick(
        allProjects.map((project) => ({
          label: project.label,
          project,
          picked: project.tags.includes(tag),
        })),
        {
          matchOnDetail: true,
          matchOnDescription: true,
          canPickMany: true,
        }
      )
    )?.map((p) => p.project);
    if (!projects) {
      return;
    }

    const configs: Array<ManiConfig> = [];

    // remove existing tags
    for (const p of projectsWithTag) {
      if (!projects.includes(p)) {
        p.raw.tags = p.tags.filter((t) => t !== tag);
        const c = config.getConfigForProject(p);
        if (c && !configs.includes(c)) {
          configs.push(c);
        }
      }
    }

    // add new tags
    for (const p of projects) {
      if (p.raw && !p.raw.tags?.includes(tag)) {
        p.raw.tags = [...p.tags, tag];
        const c = config.getConfigForProject(p);
        if (c && !configs.includes(c)) {
          configs.push(c);
        }
      }
    }
    await Promise.all(
      configs.map(async (c) => {
        await writeYaml(c.uri, c.raw);
      })
    );
  }
}
