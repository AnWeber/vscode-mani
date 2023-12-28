import { createTerminal } from "../utils";
import { Task } from "./maniYaml";

export class ManiTask {
  public readonly description?: string;
  public readonly detail?: string;
  public constructor(
    public readonly label: string,
    public readonly raw: string | Task
  ) {
    if (typeof raw !== "string") {
      this.description = raw.desc;
      this.detail = raw.cmd || raw.commands?.map((cmd) => cmd.name).join(", ");
    } else {
      this.description = raw;
    }
  }

  public async runInTerminal(): Promise<void> {
    const terminal = createTerminal();
    terminal.sendText(`mani run ${this.label}`);
    terminal.show(true);
  }
}
