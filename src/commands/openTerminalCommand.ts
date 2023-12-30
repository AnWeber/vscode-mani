import * as vscode from "vscode";

import { errorHandler } from "../decorators";
import { ManiProject, ManiStore } from "../mani";
import { BaseCommand } from "./baseCommand";
import { pickProject } from "./openFolderCommand";

export class OpenTerminalCommand extends BaseCommand<ManiProject> {
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.openTerminal");
  }
  @errorHandler()
  protected async execute(p?: ManiProject): Promise<void> {
    const project = p || (await pickProject(this.maniStore));
    if (project) {
      const terminal = vscode.window.createTerminal({
        cwd: project?.uri.fsPath,
      });
      terminal.show();
    }
  }
}
