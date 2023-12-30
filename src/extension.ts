import * as vscode from "vscode";
import {
  AddTagsCommand,
  AddTagToProjectsCommand,
  AddWorkspaceFolderCommand,
  AutoDiscoverCommand,
  EditConfigCommand,
  ExecCommand,
  OpenFolderCommand,
  OpenTerminalCommand,
  RunTaskCommand,
  SetIconCommand,
} from "./commands";

import { initOutputChannel } from "./initOutputChannel";
import { ManiStore } from "./mani";
import { ProjectTreeDataProvider } from "./tree";

export function activate(context: vscode.ExtensionContext): void {
  const maniStore = new ManiStore();
  context.subscriptions.push(
    ...[
      initOutputChannel(),
      new AddTagsCommand(maniStore),
      new AddTagToProjectsCommand(maniStore),
      new AddWorkspaceFolderCommand(maniStore),
      new AutoDiscoverCommand(maniStore),
      new EditConfigCommand(maniStore),
      new ExecCommand(maniStore),
      new OpenFolderCommand(maniStore),
      new OpenTerminalCommand(maniStore),
      new RunTaskCommand(maniStore),
      new ProjectTreeDataProvider(maniStore),
      new SetIconCommand(maniStore),
    ]
  );
}
