import { watch } from "fs";
import * as vscode from "vscode";

import { ManiConfig } from "./maniConfig";
import { getRootManiConfig } from "./parseMani";

export class ManiStore implements vscode.Disposable {
  private maniConfig: ManiConfig | undefined;
  private abortController?: AbortController;

  private maniConfigChangedEmitter = new vscode.EventEmitter<void>();

  public get maniConfigChanged(): vscode.Event<void> {
    return this.maniConfigChangedEmitter.event;
  }

  public dispose() {
    this.reset();
  }

  public reset(): void {
    this.abortController?.abort();
    delete this.abortController;
    delete this.maniConfig;
    this.maniConfigChangedEmitter.fire();
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
        this.reset();
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
}
