import * as vscode from "vscode";

import { errorHandler } from "../decorators";
import { ManiConfig, ManiProject, ManiStore } from "../mani";
import { enumTreeItem } from "../tree";
import { createTerminal } from "../utils";
import { BaseCommand } from "./baseCommand";

export type ManiArgs = ManiProject | string;

export class ExecCommand extends BaseCommand<ManiArgs> {
  public constructor(private readonly maniStore: ManiStore) {
    super("mani.exec");
  }
  @errorHandler()
  protected async execute(param?: ManiArgs): Promise<void> {
    const config = await this.maniStore.getManiConfig();
    if (!config) {
      return;
    }
    const args = await pickArgs(config, param);

    if (!args) {
      return;
    }
    const command = await vscode.window.showInputBox({
      title: "input Command",
    });

    if (!command) {
      return;
    }

    const terminal = createTerminal();
    terminal.sendText(`mani exec ${args} "${command.split('"').join('\\"')}"`);
    terminal.show();
  }
}

type ArgItem = vscode.QuickPickItem & { args?: string; value?: string };
export async function pickArgs(config: ManiConfig, param?: ManiArgs) {
  const quickPickItems: Array<ArgItem> = [
    {
      kind: vscode.QuickPickItemKind.Separator,
      label: enumTreeItem.Tags.label,
    },
    ...config.getAllUserTags().map((tag) => ({
      label: tag,
      args: `--tags`,
      value: tag,
      picked: param === tag,
    })),
    {
      kind: vscode.QuickPickItemKind.Separator,
      label: enumTreeItem.Projects.label,
    },
    ...config.getAllProjects().map((p) => ({
      label: p.name,
      args: `--projects`,
      value: p.name,
      picked: param === p,
    })),
  ];

  let picked: Array<ArgItem> | undefined = quickPickItems.filter(
    (obj) => obj.picked
  );
  if (picked.length === 0) {
    picked = await vscode.window.showQuickPick(quickPickItems, {
      canPickMany: true,
    });
  }

  if (picked) {
    if (picked.length === 0) {
      return "--all";
    }
    return Object.entries(
      picked.reduce((prev, curr) => {
        if (curr.args) {
          if (!prev[curr.args]) {
            prev[curr.args] = [];
          }
          curr.value && prev[curr.args].push(curr.value);
        }
        return prev;
      }, {} as Record<string, Array<string>>)
    )
      .map(([key, value]) => {
        const argsBuilder = [key];
        argsBuilder.push(value.join(","));
        return argsBuilder.join("=");
      })
      .join(" ");
  }
  return undefined;
}
