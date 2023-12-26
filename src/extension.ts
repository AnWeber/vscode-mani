import * as vscode from "vscode";
import {
  AddWorkspaceFolderCommand,
  OpenFolderCommand,
  RunTaskCommand,
} from "./commands";

import { initOutputChannel } from "./initOutputChannel";
import { ManiStore } from "./mani";

export function activate(context: vscode.ExtensionContext): void {
  const maniStore = new ManiStore();
  context.subscriptions.push(
    ...[
      initOutputChannel(),
      new AddWorkspaceFolderCommand(maniStore),
      new OpenFolderCommand(maniStore),
      new RunTaskCommand(maniStore),
    ]
  );
}
