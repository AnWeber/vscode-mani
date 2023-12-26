import { ManiConfig, ManiProject, ManiTask } from "./maniConfig";
import { getRootManiConfig } from "./parseMani";

export class ManiStore {
  private maniConfig: ManiConfig | undefined;

  private async getManiConfig() {
    if (!this.maniConfig) {
      this.maniConfig = await getRootManiConfig();
    }
    return this.maniConfig;
  }

  public async getProjects(): Promise<Array<ManiProject>> {
    return this.getArray((config) => config.projects);
  }
  public async getTasks(): Promise<Array<ManiTask>> {
    return this.getArray((config) => config.tasks || []);
  }

  public async getTags(): Promise<Array<string>> {
    return (
      await this.getArray((config) => config.projects.map((p) => p.tags).flat())
    )
      .filter((val, index, array) => array.indexOf(val) === index)
      .sort();
  }

  private async getArray<T>(getter: (config: ManiConfig) => Array<T>) {
    const array: Array<T> = [];

    const config = await this.getManiConfig();

    if (config) {
      array.push(...getter(config));
      if (config.imports) {
        array.push(...config.imports.map((c) => getter(c)).flat());
      }
    }
    return array;
  }
}
