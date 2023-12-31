import * as vscode from "vscode";

import {
  AddTagsCommand,
  AddTagToProjectsCommand,
  AddWorkspaceFolderCommand,
  AutoDiscoverCommand,
  EditConfigCommand,
  ExecCommand,
  HideProjectCommand,
  OpenFolderCommand,
  OpenTerminalCommand,
  RunTaskCommand,
  SetIconCommand,
} from "./commands";
import { initOutputChannel } from "./initOutputChannel";
import { ManiStore } from "./mani";
import { registerManiSchemas } from "./schemas";
import { ProjectTreeDataProvider } from "./tree";

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
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
      new HideProjectCommand(maniStore),
      new OpenFolderCommand(maniStore),
      new OpenTerminalCommand(maniStore),
      new RunTaskCommand(maniStore),
      new ProjectTreeDataProvider(maniStore),
      new SetIconCommand(maniStore),
    ]
  );

  await registerManiSchemas();
}
