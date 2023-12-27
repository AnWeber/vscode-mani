import * as vscode from "vscode";
import {
  AddWorkspaceFolderCommand,
  AutoDiscoverCommand,
  OpenFolderCommand,
  RunTaskCommand,
} from "./commands";

import { initOutputChannel } from "./initOutputChannel";
import { ManiStore } from "./mani";
import { ProjectTreeDataProvider } from "./tree";

export function activate(context: vscode.ExtensionContext): void {
  const maniStore = new ManiStore();
  context.subscriptions.push(
    ...[
      initOutputChannel(),
      new AddWorkspaceFolderCommand(maniStore),
      new AutoDiscoverCommand(maniStore),
      new OpenFolderCommand(maniStore),
      new RunTaskCommand(maniStore),
      new ProjectTreeDataProvider(maniStore),
    ]
  );
}
