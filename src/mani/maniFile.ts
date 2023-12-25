export interface ManiFile {
  /** Import projects/tasks/env/specs/themes/targets from other configs [optional] */
  import?: string[];
  /** List of Projects */
  projects?: Record<string, Project>;
  env?: Environment;
  /**
   * Shell used for commands [optional]
   * If you use any other program than bash, zsh, sh, node, and python
   * then you have to provide the command flag if you want the command-line string evaluted
   * For instance: bash -c
   */
  shell?: string;
  targets?: Record<string, Target>;
  tasks?: Record<string, Task | string>;
}

export interface Project {
  path?: string;
  url?: string;
  desc?: string;
  clone?: string;
  tags?: string[];
  sync?: boolean;
  remotes?: Record<string, string>;
  env?: Environment;
}

export type Environment = Record<string, unknown>;

export interface Target {
  all?: boolean;
  cwd?: boolean;
  projects?: string[];
  paths?: string[];
  tags?: string[];
}

export interface Task {
  desc?: string;
  theme?: string;
  shell?: string;
  env?: Environment;
  target?: string;
  cmd?: string;
  commands?: Command[];
}

export interface Command {
  name?: string;
  cmd?: string;
  task?: string;
}

export interface Simple1 {
  cmd: string;
  desc: string;
}
