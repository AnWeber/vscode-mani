import * as vscode from "vscode";
import { CommandsController } from "./commandsController";

import { initOutputChannel } from "./initOutputChannel";

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    ...[initOutputChannel(), new CommandsController()]
  );
}
