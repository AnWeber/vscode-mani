import { ManiConfig, ManiProject, ManiTask } from "./maniConfig";
import { getRootManiConfig } from "./parseMani";
import * as vscode from "vscode";
import { watch } from "fs";

export class ManiStore implements vscode.Disposable {
  private maniConfig: ManiConfig | undefined;
  private abortController?: AbortController;

  public dispose() {
    this.reset();
  }

  public reset(): void {
    this.abortController?.abort();
    delete this.abortController;
    delete this.maniConfig;
  }

  public async getManiConfig() {
    if (!this.maniConfig) {
      this.maniConfig = await getRootManiConfig();
      this.watchForConfigChanges();
    }
    return this.maniConfig;
  }

  private watchForConfigChanges() {
    if (this.maniConfig) {
      const onChange = () => {
        this.abortController?.abort();
        delete this.maniConfig;
      };
      this.abortController?.abort();
      this.abortController = new AbortController();

      watch(
        this.maniConfig?.uri.fsPath,
        {
          signal: this.abortController.signal,
        },
        onChange
      );
      for (const config of this.maniConfig.imports || []) {
        watch(
          config?.uri.fsPath,
          {
            signal: this.abortController.signal,
          },
          onChange
        );
      }
    }
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
