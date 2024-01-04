import { EOL } from "os";
import { Uri } from "vscode";

import { logger } from "../initOutputChannel";
import { ManiStore } from "../mani";
import { getConfig, runShell } from "../utils";
import { GitBranch } from "./gitBranch";
export class GitStore {
  public constructor(private readonly maniStore: ManiStore) {}

  public async getBranches(): Promise<Array<GitBranch>> {
    const branches: Array<GitBranch> = [];

    const config = await this.maniStore.getManiConfig();
    if (!config) {
      return [];
    }
    const tags = getConfig().get("branchView.hiddenByTag") || [];
    for (const p of config.getAllProjects().filter((p) => !!p.raw.url)) {
      if (p.tags.some((t) => tags.includes(t))) {
        continue;
      }
      try {
        const gitInfo = await this.getGitBranchesForUri(p.uri);

        for (const branch of gitInfo.branches) {
          if (!branch) {
            continue;
          }
          let gitBranch = branches.find((b) => b.name === branch);
          if (!gitBranch) {
            gitBranch = new GitBranch(branch);
            branches.push(gitBranch);
          }
          gitBranch.projects.push(p);
        }
      } catch (err) {
        logger.error("error while resolving git branches", err);
      }
    }

    return branches;
  }

  private async getGitBranchesForUri(uri: Uri) {
    const result = await runShell("git branch", {
      cwd: uri.fsPath,
    });

    const removeDefaultBranchMarker = (b: string | undefined) =>
      b?.replace("* ", "").trim();

    const branches = result.split(EOL).filter((b) => !!b);
    const defaultBranch = removeDefaultBranchMarker(
      branches.find((b) => b.startsWith("*"))
    );
    return {
      defaultBranch,
      branches: branches.map((b) => removeDefaultBranchMarker(b)),
    };
  }
}
