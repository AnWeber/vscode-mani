import * as vscode from "vscode";

export abstract class BaseCommand<T = void> implements vscode.Disposable {
  private disposables: Array<vscode.Disposable> = [];
  constructor(...commands: Array<string>) {
    this.disposables.push(
      ...commands.map((command) =>
        vscode.commands.registerCommand(command, this.execute, this)
      )
    );
  }
  public dispose(): void {
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
    this.disposables.length = 0;
  }

  protected abstract execute(...args: T[]): Promise<void>;
}
