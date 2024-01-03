import * as vscode from "vscode";

import { errorHandler } from "../decorators";
import { GitBranch } from "../git";
import { logInfo } from "../initOutputChannel";
import { getConfig } from "../utils";
import { BaseCommand } from "./baseCommand";

export class OpenJiraCommand extends BaseCommand<GitBranch> {
  public constructor() {
    super("mani.openJira");
  }
  @errorHandler()
  protected async execute(b: GitBranch): Promise<void> {
    if (!(b instanceof GitBranch)) {
      return;
    }

    const match = /([A-Z][A-Z0-9]+-[0-9]+)/gu.exec(b.name);

    if (!match || match.length < 1) {
      return;
    }
    const jiraUrl = getConfig().get("jiraUrl");

    if (!jiraUrl) {
      return;
    }
    const url = `${jiraUrl}/browse/${match[1]}`;
    logInfo(`open url ${url}`);
    vscode.env.openExternal(vscode.Uri.parse(url));
  }
}
