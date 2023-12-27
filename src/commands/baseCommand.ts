import * as vscode from "vscode";

export abstract class BaseCommand<T = void> implements vscode.Disposable {
  private disposable: vscode.Disposable;
  constructor(command: string) {
    this.disposable = vscode.commands.registerCommand(
      command,
      this.execute,
      this
    );
  }
  public dispose(): void {
    this.disposable.dispose();
  }

  protected abstract execute(...args: T[]): Promise<void>;
}
