import { Uri } from "vscode";

import { ManiProject } from "./maniProject";
import { ManiTask } from "./maniTask";
import { ManiYaml } from "./maniYaml";
import { SpecialTags } from "./specialTags";

export class ManiConfig {
  public readonly projects: Array<ManiProject>;
  public readonly tasks: Array<ManiTask>;
  public readonly imports: Array<ManiConfig> = [];
  public constructor(
    public readonly uri: Uri,
    public readonly raw: ManiYaml,
    public readonly path: string | undefined
  ) {
    this.projects = this.parseProjects();
    this.tasks = this.parseTasks();
  }

  private parseProjects() {
    const projects: Array<ManiProject> = [];
    if (this.raw?.projects) {
      for (const [name, project] of Object.entries(this.raw.projects)) {
        projects.push(
          new ManiProject(
            name,
            Uri.joinPath(this.uri, "..", project?.path || name),
            project,
            this.path
          )
        );
      }
    }
    return projects;
  }

  private parseTasks(): Array<ManiTask> {
    const tasks: Array<ManiTask> = [];
    if (this.raw?.tasks) {
      tasks.push(
        ...Object.entries(this.raw.tasks).map(([name, task]) => {
          return new ManiTask(name, task);
        })
      );
    }
    return tasks;
  }

  public getAllProjects(): Array<ManiProject> {
    return this.getArray((config) => config.projects)
      .filter((p) => !p.isHidden)
      .sort((p1, p2) => p1.name.localeCompare(p2.name));
  }
  public getAllTasks(): Array<ManiTask> {
    return this.getArray((config) => config.tasks).sort((task1, task2) =>
      task1.label.localeCompare(task2.label)
    );
  }

  public getAllTags(): Array<string> {
    return this.getArray((config) =>
      config.projects
        .filter((p) => !p.isHidden)
        .map((p) => p.tags)
        .flat()
    )
      .filter((val, index, array) => array.indexOf(val) === index)

      .sort();
  }

  public getAllUserTags(): Array<string> {
    return this.getAllTags().filter((tag) =>
      Object.values(SpecialTags).every((st) => !tag.startsWith(st))
    );
  }

  private getArray<T>(getter: (config: ManiConfig) => Array<T>) {
    const array: Array<T> = [];
    array.push(...getter(this));
    array.push(...this.imports.map((c) => getter(c)).flat());

    return array;
  }

  public getConfigForProject(p: ManiProject): ManiConfig | undefined {
    if (p.configPath) {
      return this.imports.find((c) => c.path === p.configPath);
    } else {
      return this;
    }
  }
}
