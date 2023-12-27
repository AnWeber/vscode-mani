import * as vscode from "vscode";
import {
  AddWorkspaceFolderCommand,
  AutoDiscoverCommand,
  InitCommand,
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
      new AutoDiscoverCommand(maniStore),
      new InitCommand(maniStore),
      new OpenFolderCommand(maniStore),
      new RunTaskCommand(maniStore),
    ]
  );
}
