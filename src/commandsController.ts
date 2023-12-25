import * as vscode from "vscode";
import { getRootManiConfig } from "./mani";
import { command, errorHandler } from "./decorators";

const subscriptions: Array<vscode.Disposable> = [];
export class CommandsController implements vscode.Disposable {
  public dispose(): void {
    for (const disposable of subscriptions) {
      disposable.dispose();
    }
    subscriptions.length = 0;
  }

  @command(subscriptions)
  @errorHandler()
  public async openFolder(): Promise<void> {
    const maniConfig = await getRootManiConfig();
    if (maniConfig?.projects) {
      const pick = await vscode.window.showQuickPick(maniConfig?.projects, {});

      if (pick?.uri) {
        vscode.commands.executeCommand("vscode.openFolder", pick.uri, true);
      }
    }
  }

  @command(subscriptions)
  @errorHandler()
  public async addWorkspaceFolder(): Promise<void> {
    const maniConfig = await getRootManiConfig();
    if (maniConfig?.projects) {
      const pick = await vscode.window.showQuickPick(maniConfig?.projects, {});

      if (pick?.uri) {
        vscode.workspace.updateWorkspaceFolders(0, 0, {
          name: pick.label,
          uri: pick.uri,
        });
      }
    }
  }
}
