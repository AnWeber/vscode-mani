import { ManiProject } from "../mani";

export class GitBranch {
  public constructor(public readonly name: string) {}

  public readonly projects: Array<ManiProject> = [];
}
