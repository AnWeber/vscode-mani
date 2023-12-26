import { ManiProject, ManiStore } from "../mani";
import * as vscode from "vscode";

export async function pickProject(
  maniStore: ManiStore
): Promise<ManiProject | undefined> {
  const projects = await maniStore.getProjects();
  const project = await vscode.window.showQuickPick(projects, {
    matchOnDetail: true,
    matchOnDescription: true,
  });

  return project;
}
